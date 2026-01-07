// Utils
import { renameSync, readdirSync, unlinkSync } from "fs"
import { join } from "path"

// Config
import Config from "../../Config"

// Template
import { MigrationTemplate } from "../../ModuleTemplates"

// Decorators
import { Logs } from "../Decorators"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { ActionType } from "../../DatabaseSchema"
import type { ModuleExtension } from "../../ModuleTemplates/types"
import type { CreateMigrationFileProps, SyncMigrationFileProps } from "./types"

export default class MigrationFileHandler {
    private readonly BASE_DIR = Config.migrationsDir
    public static readonly extensions: ModuleExtension[] = [
        '.ts', '.js', '.cts', '.cjs', '.mts', '.mjs'
    ]

    constructor(private connection: PolyORMConnection) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get dir(): string {
        return this.connection.name
    }

    // ------------------------------------------------------------------------

    public get absolute(): string {
        return join(this.BASE_DIR, this.dir)
    }

    // ------------------------------------------------------------------------

    public get files(): string[] {
        return readdirSync(join(this.BASE_DIR, this.dir))
    }

    // ------------------------------------------------------------------------

    public get orderedFiles(): [number, string][] {
        return this.files.map(file => [parseInt(file.split('-')[0]), file])
    }

    // ------------------------------------------------------------------------

    public get lastOrder(): number {
        return this.orderedFiles[this.orderedFiles.length - 1][0]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Logs.CreateMigrationFile
    public create(
        dir: string,
        action: ActionType,
        properties: CreateMigrationFileProps,
    ): void {
        const { order, name, fileName, tableName } = properties

        if (order <= this.lastOrder) this.incrementOrder(order, this.lastOrder)

        return new MigrationTemplate(
            dir,
            action,
            name,
            fileName,
            tableName
        )
            .create()
    }

    // ------------------------------------------------------------------------

    @Logs.DeleteMigrationFile
    public delete(deleted: number): void {
        const [_, file] = this.orderedFiles.find(
            ([order]) => order === deleted
        )!

        unlinkSync(join(this.absolute, file))
        this.decrementOrder(deleted, this.lastOrder)
    }

    // ------------------------------------------------------------------------

    @Logs.CreateMigrationFile
    public sync(
        dir: string,
        action: ActionType,
        properties: SyncMigrationFileProps,
    ): void {
        const {
            name,
            fileName,
            tableName,
            metadata,
            schemas: [schema, prevSchema]
        } = properties

        return new MigrationTemplate(
            dir,
            action,
            name,
            fileName,
            tableName
        )
            .sync(metadata, schema, prevSchema)
            .create()
    }

    // ------------------------------------------------------------------------

    public move(from: number, to: number): void {
        if (from === to) return

        const file = this.orderedFiles.find(([order]) => order === from)
        if (!file) throw new Error

        const [_, name] = file
        const tempName = this.removeOrder(name)

        if (from > to) this.incrementOrder(from, to)
        else this.decrementOrder(from, to)

        this.addOrder(tempName, to)
    }

    // Privates ---------------------------------------------------------------
    private incrementOrder(from: number, to: number): void {
        for (const [order, file] of this.orderedFiles
            .filter(([order]) => order >= to && order < from)
            .reverse()
        ) (
            renameSync(
                join(this.absolute, file),
                join(this.absolute, (
                    (order + 1) + '-' + file.split('-').slice(1).join('-')
                ))
            )
        )
    }

    // ------------------------------------------------------------------------

    private decrementOrder(from: number, to: number): void {
        for (const [order, file] of this.orderedFiles
            .filter(([order]) => order <= to && order > from)
            .reverse()
        ) (
            renameSync(
                join(this.absolute, file),
                join(
                    this.absolute, (
                    (order - 1) + '-' + file.split('-').slice(1).join('-')
                ))
            )
        )
    }

    // ------------------------------------------------------------------------

    private addOrder(name: string, order: number): string {
        const added = order + '-' + name
        renameSync(
            join(this.absolute, name),
            join(this.absolute, added)
        )

        return added
    }

    // ------------------------------------------------------------------------

    private removeOrder(name: string): string {
        const removed = name.split('-').slice(1).join('-')
        renameSync(
            join(this.absolute, name),
            join(this.absolute, removed)
        )

        return removed
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildClassName(
        action: ActionType,
        tableName: string
    ): string {
        return MigrationTemplate.buildClassName(action, tableName)
    }

    // ------------------------------------------------------------------------

    public static toPascalCase(...parts: string[]): string {
        return MigrationTemplate.toPascalCase(...parts)
    }
}

export type {
    CreateMigrationFileProps,
    SyncMigrationFileProps
}