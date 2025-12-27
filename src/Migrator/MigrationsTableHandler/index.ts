// Metadata
import { DataType } from "../../Metadata"

// Migrators
import { TableMigrator, ColumnMigrator } from "../DatabaseMigrator"

// Procedures
import {
    InsertMigration,
    DeleteMigration,
    MoveMigration,
} from "../../SQLBuilders"

// Helpers
import { SQLString } from "../../Handlers"

// Decorators
import { Logs } from "../Decorators"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { MigrationData } from "./types"

export default class MigrationsTableHandler {
    public static readonly tableName: string = '__migrations'

    constructor(private connection: PolyORMConnection) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createIfNotExists(): Promise<void> {
        return MigrationsTableHandler.buildMigrator().createIfNotExists(
            this.connection
        )
    }

    // ------------------------------------------------------------------------

    public drop(): Promise<void> {
        return MigrationsTableHandler.buildMigrator().drop(this.connection)
    }

    // ------------------------------------------------------------------------

    public async findAll(): Promise<MigrationData[]> {
        return this.connection.query(MigrationsTableHandler.findAllSQL())
    }

    // ------------------------------------------------------------------------

    @Logs.RegisterMigration
    public async insert(name: string, at?: number, createdAt?: string) {
        const [[inserted, ...reordered]] = await InsertMigration
            .connection(this.connection)
            .call(name, at, createdAt)

        return [inserted, reordered] as [MigrationData, MigrationData[]]
    }

    // ------------------------------------------------------------------------

    @Logs.EraseMigration
    public async delete(id: string | number): Promise<number> {
        const [_, { "@deleted_order": deleted }] = (
            await DeleteMigration.connection(this.connection).call(id)
        )

        return deleted
    }

    // ------------------------------------------------------------------------

    public async move(from: number, to: number): Promise<void> {
        await MoveMigration.connection(this.connection).call(from, to)
    }

    // ------------------------------------------------------------------------

    public async toRoll(): Promise<MigrationData[]> {
        return this.connection.query(MigrationsTableHandler.toRollSQL())
    }

    // ------------------------------------------------------------------------

    public async toRollback(): Promise<MigrationData[]> {
        return this.connection.query(MigrationsTableHandler.toRollbackSQL())
    }

    // ------------------------------------------------------------------------

    public async setMigrated(id: string | number, time: number): (
        Promise<void>
    ) {
        await this.connection.query(
            MigrationsTableHandler.setMigratedSQL(id, time)
        )
    }

    // ------------------------------------------------------------------------

    public async unsetMigrated(id: string | number): Promise<void> {
        await this.connection.query(
            MigrationsTableHandler.unsetMigratedSQL(id)
        )
    }

    // ------------------------------------------------------------------------

    public async unsetMigratedAll(): Promise<void> {
        await this.connection.query(
            MigrationsTableHandler.unsetMigratedAllSQL()
        )
    }

    // ------------------------------------------------------------------------

    public async nextMigrationTime(): Promise<number> {
        const [{ next }] = await this.connection.query(
            MigrationsTableHandler.nextMigrationTimeSQL()
        )

        return next
    }

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static findAllSQL(): string {
        return SQLString.sanitize(`
            SELECT \`order\`, \`name\`, \`fileName\` FROM __migrations;
        `)
    }

    // ------------------------------------------------------------------------

    private static toRollSQL(): string {
        return SQLString.sanitize(`
            SELECT \`name\`, \`order\`, \`fileName\` FROM __migrations
            WHERE migrated = FALSE
        `)
    }

    // ------------------------------------------------------------------------

    private static toRollbackSQL(): string {
        return SQLString.sanitize(`
            SELECT \`name\`, \`order\`, \`fileName\` FROM __migrations
            WHERE 
                migrated = TRUE 
                AND migratedTime = COALESCE(
                    (SELECT MAX(migratedTime) FROM __migrations), 1
                )
        `)
    }

    // ------------------------------------------------------------------------

    private static setMigratedSQL(id: string | number, time: number): string {
        return SQLString.sanitize(`
            UPDATE __migrations
            SET
                migrated = TRUE,
                migratedTime = ${time},
                migratedAt = NOW(),
                updatedAt = NOW()
            WHERE \`name\` = "${id}"
                OR \`fileName\` = "${id}"
                OR (
                    "${id}" REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST("${id}" AS UNSIGNED)
                );   
        `)
    }

    // ------------------------------------------------------------------------

    private static unsetMigratedSQL(id: string | number): string {
        return SQLString.sanitize(`
            UPDATE __migrations
            SET
                migrated = 0,
                migratedTime = NULL,
                migratedAt = NULL
            WHERE \`name\` = "${id}"
                OR \`fileName\` = "${id}"
                OR (
                    "${id}" REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST("${id}" AS UNSIGNED)
                );  
        `)
    }

    // ------------------------------------------------------------------------

    private static unsetMigratedAllSQL(): string {
        return SQLString.sanitize(`
            UPDATE __migrations SET
                migrated = FALSE,
                migratedTime = NULL,
                migratedAt = NULL;  
        `)
    }

    // ------------------------------------------------------------------------

    private static nextMigrationTimeSQL(): string {
        return SQLString.sanitize(`
            SELECT COALESCE(MAX(migratedTime), 0) + 1 AS next
            FROM __migrations    
        `)
    }

    // ------------------------------------------------------------------------

    private static buildMigrator(): TableMigrator {
        const { tableName } = MigrationsTableHandler

        return new TableMigrator(
            undefined,
            tableName,

            new ColumnMigrator({
                tableName,
                name: 'id',
                dataType: DataType.INT('BIG'),
                unsigned: true,
                autoIncrement: true,
                primary: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'name',
                dataType: DataType.VARCHAR(),
                unique: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'order',
                dataType: DataType.INT(),
                unique: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'fileName',
                dataType: DataType.COMPUTED(
                    DataType.VARCHAR(),
                    `CONCAT(\`order\`, '-', \`name\`, '-',
                         DATE_FORMAT(\`createdAt\`, '%Y-%m-%d')
                    )`,
                    "STORED"
                ),
            }),

            new ColumnMigrator({
                tableName,
                name: 'migrated',
                dataType: DataType.BOOLEAN(),
                defaultValue: false
            }),

            new ColumnMigrator({
                tableName,
                name: 'migratedTime',
                dataType: DataType.INT(),
                nullable: true,
                defaultValue: null
            }),

            new ColumnMigrator({
                tableName,
                name: 'migratedAt',
                dataType: DataType.TIMESTAMP(),
                nullable: true,
                defaultValue: null,
            }),

            new ColumnMigrator({
                tableName,
                name: 'createdAt',
                dataType: DataType.TIMESTAMP(),
                defaultValue: Date.now,
            }),

            new ColumnMigrator({
                tableName,
                name: 'updatedAt',
                dataType: DataType.TIMESTAMP(),
                defaultValue: Date.now,
            }),
        )
    }
}

export {
    type MigrationData
}