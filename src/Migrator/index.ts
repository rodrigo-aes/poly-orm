// Config
import Config from "../Config"

// Metadata
import { EntityMetadata } from "../Metadata"

// Database Schema
import DatabaseSchema, { type ActionType } from "../DatabaseSchema"

// Migrators
import DatabaseMigrator from "./DatabaseMigrator"

// Migration
import Migration from "./Migration"

// Handlers
import MigrationFileHandler from "./MigrationFileHandler"
import MigrationsTableHandler, {
    type MigrationData
} from "./MigrationsTableHandler"

// Decorators
import { Logs } from "./Decorators"

// Utils
import { join } from "path"
import { readdirSync, mkdirSync, existsSync } from "fs"
import { pathToFileURL } from "url"
import readline from 'readline'

// Static
import {
    registerUnknownQuestion,
    setAlreadyRunnedQuestion,
} from "./Static"

// Types
import type { PolyORMConnection } from "../Metadata"
import type { Constructor } from "../types"
import type { MigrationRunMethod, MigrationSyncAction } from "./types"

// Exceptions
import PolyORMException from "../Errors"

export default class Migrator extends Array<Constructor<Migration>> {
    private database!: DatabaseSchema | DatabaseMigrator

    private _metas?: EntityMetadata[]

    private _tableHandler?: MigrationsTableHandler
    private _fileHandler?: MigrationFileHandler

    private _files?: string[]
    private _registers?: string[]

    constructor(private connection: PolyORMConnection) {
        super()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get metadatas(): EntityMetadata[] {
        return this._metas ??= this.connection.entities.map(
            entity => EntityMetadata.findOrThrow(entity)
        )
    }

    // ------------------------------------------------------------------------

    private get interface(): readline.Interface {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
    }

    // ------------------------------------------------------------------------

    private get tableHandler(): MigrationsTableHandler {
        return this._tableHandler ??= new MigrationsTableHandler(
            this.connection
        )
    }

    // ------------------------------------------------------------------------

    private get fileHandler(): MigrationFileHandler {
        return this._fileHandler ??= new MigrationFileHandler(
            this.connection
        )
    }

    // ------------------------------------------------------------------------

    private get dir(): string {
        return join(Config.migrationsDir, this.connection.name)
    }

    // ------------------------------------------------------------------------

    private get files(): string[] {
        return this._files ??= readdirSync(this.dir)
            .filter(name => MigrationFileHandler.extensions.some(
                ext => name.endsWith(ext)
            ))
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Logs.InitProccess
    public async init(): Promise<void> {
        this.verifyDir()
        await this.tableHandler.drop()
        await this.tableHandler.createIfNotExists()
        await this.verifyUnknown()
    }

    // ------------------------------------------------------------------------

    @Logs.RunMainProcess
    public async reset(): Promise<void> {
        await this.loadProcessDependencies()

        await DatabaseMigrator.buildFromSchema(this.database).dropAll()
        await this.tableHandler.unsetMigratedAll()

        await this.run()
    }

    // ------------------------------------------------------------------------

    @Logs.RunMainProcess
    public async run(): Promise<void> {
        console.log('run')
        await this.loadProcessDependencies('run')

        const migrator = new DatabaseMigrator(this.connection)
        const time = await this.tableHandler.nextMigrationTime()

        for (const Migration of this) await this.runMigration(
            migrator,
            Migration,
            time
        )
    }

    // ------------------------------------------------------------------------

    @Logs.RunMainProcess
    public async back(): Promise<void> {
        await this.loadProcessDependencies('back')

        const migrator = DatabaseMigrator.buildFromSchema(this.database)

        for (const Migration of this.reverse()) await this.backMigration(
            migrator,
            Migration
        )
    }

    // ------------------------------------------------------------------------

    @Logs.SyncProccess
    public async sync(): Promise<void> {
        await this.loadProcessDependencies()

        this.database = new DatabaseSchema(this.connection)
        const schema = DatabaseSchema.buildFromConnectionMetadata(
            this.connection
        )

        for (const migration of await this.instantiate()) migration.up()

        await this.syncMigrations(schema)
    }

    // ------------------------------------------------------------------------

    @Logs.CreateMigrationProcess
    public async create(
        action: ActionType,
        tableName: string,
        className?: string,
        at?: number
    ) {
        this.fileHandler.create(this.connection.name, action, {
            ...(await this.tableHandler.insert(
                className ?? MigrationFileHandler.buildClassName(
                    action, tableName
                ),
                at
            ))[0],
            tableName
        })
    }

    // ------------------------------------------------------------------------

    @Logs.RegisterMigrationsProccess
    public async register(): Promise<void> {
        const unknown = await this.unknownMigrationFiles(false)
        if (unknown.length === 0) return

        const last = (await this.registered()).length

        for (const file of unknown) {
            const [at, name, createdAt] = this.fileNameToInsertProps(file)

            await this.tableHandler.insert(
                name,
                at <= last ? at : undefined,
                createdAt
            )
        }
    }

    // ------------------------------------------------------------------------

    @Logs.DeleteMigrationProcess
    public async delete(id: string | number): Promise<void> {
        const deleted = await this.tableHandler.delete(id)
        this.fileHandler.delete(deleted)
    }

    // ------------------------------------------------------------------------

    @Logs.MoveMigrationProccess
    public async move(from: number, to: number): Promise<void> {
        await this.tableHandler.move(from, to)
        this.fileHandler.move(from, to)
    }

    // Privates ---------------------------------------------------------------
    private verifyDir(): void {
        console.log('DIR:', this.dir)
        if (!existsSync(this.dir)) mkdirSync(this.dir, { recursive: true })
    }

    // ------------------------------------------------------------------------

    private async loadProcessDependencies(method?: MigrationRunMethod): (
        Promise<void>
    ) {
        await this.loadMigrations(method)
        await this.verifyUnknown()
        if (!this.database) await this.loadDatabaseSchema()
    }

    // ------------------------------------------------------------------------

    private async instantiate(): Promise<Migration[]> {
        return this.map(migration => new migration(this.database))
    }

    // ------------------------------------------------------------------------

    private async registered(): Promise<string[]> {
        return this._registers ??= (await this.tableHandler.findAll())
            .map(({ fileName }) => fileName)
    }

    // ------------------------------------------------------------------------

    private async loadDatabaseSchema(): Promise<void> {
        this.database = await DatabaseSchema.buildFromDatabase(this.connection)
        this.database.splice(
            this.database.findIndex(
                ({ name }) => name === MigrationsTableHandler.tableName
            ),
            1
        )
    }

    // ------------------------------------------------------------------------

    private async verifyUnknown(): Promise<void> {
        if ((await this.unknownMigrationFiles()).length > 0) return (
            new Promise(resolve => this.interface.question(
                registerUnknownQuestion(this.connection.name),
                async answer => {
                    if (answer.toLowerCase().startsWith('y')) (
                        await this.register()
                    )

                    this.interface.close()
                    resolve()
                }
            ))
        )
    }

    // ------------------------------------------------------------------------

    @Logs.NothingToRegister
    private async unknownMigrationFiles(silent: boolean = true): Promise<
        string[]
    > {
        const registered = await this.registered()
        return this.files.filter(file => !registered.includes(
            file.split('.')[0]
        ))
    }

    // ------------------------------------------------------------------------

    private async loadMigrations(method?: MigrationRunMethod): Promise<void> {
        const files = method ? await this.filterFiles(method) : this.files
        if (method) this.splice(0, this.length)

        this.push(...await Promise.all(
            files.map(async file =>
                (await import(pathToFileURL(join(this.dir, file)).href))
                    .default
            )))
    }

    // ------------------------------------------------------------------------

    private async filterFiles(method: MigrationRunMethod): Promise<string[]> {
        const included = await this.included(method)
        if (included.length === 0) return []

        return this.files.filter(name => included.includes(name.split('.')[0]))
    }

    // ------------------------------------------------------------------------

    @Logs.NothingToRun
    private async included(method: MigrationRunMethod): (
        Promise<string[]>
    ) {
        switch (method) {
            case "run": return (await this.tableHandler.toRoll())
                .map(({ fileName }) => fileName)

            case "back": return (await this.tableHandler.toRollback())
                .map(({ fileName }) => fileName)
        }
    }

    // ------------------------------------------------------------------------

    @Logs.RunChildProcess
    private async runMigration(
        migrator: DatabaseMigrator,
        migration: Constructor<Migration>,
        time: number
    ): Promise<void> {
        try {
            new migration(migrator).up()

            await migrator.executeActions(true)
            await this.tableHandler.setMigrated(migration.name, time)
            await migrator.executeTriggersActions()

        } catch (error: any) {
            await this.askAlreadyRunned(
                error,
                migration.name,
                'UP',
                time
            )
        }
    }

    // ------------------------------------------------------------------------

    @Logs.RunChildProcess
    private async backMigration(
        migrator: DatabaseMigrator,
        migration: Constructor<Migration>
    ): Promise<void> {
        try {
            new migration(migrator).down()

            await migrator.executeActions(true)
            await this.tableHandler.unsetMigrated(migration.name)
            await migrator.executeTriggersActions()

        } catch (error: any) {
            await this.askAlreadyRunned(
                error,
                migration.name,
                'DOWN'
            )
        }
    }

    // ---------------------------------------------------'---------------------

    private async syncMigrations(schema: DatabaseSchema): Promise<void> {
        for (const [action, [table, prev]] of
            this.syncMigrationsActions(schema)
        ) {
            const [props] = await this.tableHandler.insert(
                MigrationFileHandler.buildClassName(action, table.name)
            )

            this.fileHandler.sync(this.connection.name, action, {
                ...props,
                tableName: table.name,
                metadata: this.findTableMetaOrThrow(table.name),
                schemas: [table, prev]
            })
        }
    }

    // ------------------------------------------------------------------------

    private syncMigrationsActions(schema: DatabaseSchema): (
        MigrationSyncAction[]
    ) {
        return this.toSyncAlterActions(schema)
            .concat(this.toSyncDropActions(schema))
    }

    // ------------------------------------------------------------------------

    private toSyncAlterActions(schema: DatabaseSchema): MigrationSyncAction[] {
        return schema.flatMap(table => {
            const prev = this.database.findTable(table.name)
            const action = table.compare(prev) as ActionType

            return action !== 'NONE'
                ? [[action, [table, prev]]]
                : []
        })
    }

    // ------------------------------------------------------------------------

    private toSyncDropActions(schema: DatabaseSchema): MigrationSyncAction[] {
        return this.database
            .filter(({ name }) => !schema.findTable(name))
            .map(table => ['DROP', [table, undefined]])
    }

    // ------------------------------------------------------------------------

    private findTableMetaOrThrow(tableName: string): EntityMetadata {
        return this.metadatas.find(meta => meta.tableName === tableName)!
            ?? PolyORMException.MySQL.throwOutOfOperation(
                'UNKNOWN_TABLE', this.connection.database, tableName
            )
    }

    // ------------------------------------------------------------------------

    private fileNameToInsertProps(fileName: string): (
        [number, string, string | undefined]
    ) {
        const [order, name, ...rest] = fileName
            .split('.')[0]
            .split('-')

        if (!order) throw new Error
        if (!name) throw new Error

        const at = parseInt(order)

        const createdAt = rest.length === 3 ? rest.join('-') : undefined
        if (createdAt && isNaN(new Date(createdAt).getTime())) throw (
            new Error
        )

        return [at, name, createdAt]
    }

    // ------------------------------------------------------------------------

    private askAlreadyRunned(
        error: any,
        ...args: any[]
    ): Promise<void> {
        const { name, code, message } = error
        const [migration, method, time] = args

        return new Promise(resolve => this.interface.question(
            setAlreadyRunnedQuestion(
                name, code, message, migration, method
            ),
            async answer => {
                if (answer.toLowerCase().startsWith('y')) switch (method) {
                    case 'UP': await this.tableHandler.setMigrated(
                        migration,
                        time
                    )
                        break

                    case 'DOWN': await this.tableHandler.unsetMigrated(
                        migration
                    )
                        break
                }

                else switch (this.connection.type) {
                    case 'MySQL': PolyORMException.MySQL.throwByError(
                        error, this.connection.name
                    )
                }

                this.interface.close()
                resolve()
            }
        )
        )
    }
}

export {
    Migration,
    type MigrationData
}