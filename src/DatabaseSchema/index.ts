import { EntityMetadata } from "../Metadata"

import TableSchema, {
    ColumnSchema,
    ForeignKeyRefSchema,
    CheckConstraintSchema,

    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ColumnSchemaChild,
    type ForeignKeyRefSchemaMap
} from "./TableSchema"

import TriggersSchema, { TriggerSchema } from "./TriggersSchema"

// Statics 
import { databaseSchemaQuery } from "./static"

// Types
import type { PolyORMConnection } from "../Metadata"
import type { Constructor } from "../types"
import type {
    DatabaseSchemaAction,
    ActionType,
    TableSchemaHandler
} from "./types"

// Exceptions
import PolyORMException from "../Errors"

export default class DatabaseSchema<
    T extends TableSchema = TableSchema
> extends Array<T> {
    /** @internal */
    public static databaseSchemaQuery = databaseSchemaQuery

    /** @internal */
    public actions: DatabaseSchemaAction[] = []

    /** @internal */
    public triggers!: TriggersSchema

    /** @internal */
    protected previous?: DatabaseSchema<T>

    /** @internal */
    constructor(
        /** @internal */
        public connection: PolyORMConnection,

        ...tables: (T | TableSchemaInitMap)[]
    ) {
        super()
        this.push(...tables.map(table => table instanceof TableSchema
            ? table
            : new TableSchema(
                this,
                table.tableName,
                ...table.columns
            ) as T
        ))

        this.orderByDependencies()
    }

    /** @internal */
    static get [Symbol.species]() {
        return Array
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static get TableConstructor(): typeof TableSchema {
        return TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a database table
     * @param name - Table name 
     * @param handle - Handle table columns and attributes
     */
    public createTable(name: string, handle: TableSchemaHandler): void {
        const table = new TableSchema(this, name) as T

        this.push(table)
        this.actions.push(['CREATE', table])

        return handle(table)
    }

    // ------------------------------------------------------------------------

    /**
     * Alter a database table
     * @param name - Table name 
     * @param handle - Handle table columns and attributes changes
     */
    public alterTable(name: string, handle: TableSchemaHandler): void {
        const table = this.findOrThrow(name)
        this.actions.push(['ALTER', table])

        return handle(table)
    }

    // ------------------------------------------------------------------------

    /**
     * Drop a database table
     * @param name - Table name
     */
    public dropTable(name: string): void {
        const table = this.findOrThrow(name)
        this.actions.push(['DROP', table])
    }

    // ------------------------------------------------------------------------

    /**
     * Create a trigger from a database table
     * @param tableName - Table name
     * @param name - Trigger name
     * @returns - A trigger schema to handle
     */
    public createTrigger(tableName: string, name: string): TriggerSchema {
        return this.triggersSchema().create(tableName, name)
    }

    // ------------------------------------------------------------------------

    public alterTrigger(tableName: string, name: string): TriggerSchema {
        return this.triggersSchema().alter(tableName, name)
    }

    // ------------------------------------------------------------------------

    public dropTrigger(tableName: string, name: string): void {
        this.triggersSchema().drop(tableName, name)
    }

    // ------------------------------------------------------------------------

    /**
     * Find a table schema by name
     * @param name - Table name
     */
    public findTable(name: string): T | undefined {
        return this.find(t => t.name === name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public findOrThrow(name: string): T {
        const table = this.findTable(name)

        if (!table) PolyORMException.MySQL.throwByCode(
            'UNKNOWN_TABLE', this.connection.name, undefined, [name]
        )

        return table as T
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private orderByDependencies(): this {
        return this.sort((a, b) => a.dependencies.includes(b.name) ? -1 : 1)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected async previuosSchema(): Promise<DatabaseSchema<T>> {
        if (this.previous) return this.previous

        this.previous = new DatabaseSchema(
            this.connection,
            ...await this.connection.query(
                databaseSchemaQuery(),
                undefined,
            )
        )

        return this.previous
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected triggersSchema(): TriggersSchema {
        if (this.triggers) return this.triggers

        return this.triggers = TriggersSchema.buildFromMetadatas(
            this.connection,
            ...this.connection.entities.flatMap(
                target => {
                    const meta = EntityMetadata.findOrBuild(target)
                    return meta.triggers ? [meta.triggers] : []
                }
            )
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public static buildFromConnectionMetadata<
        T extends Constructor<DatabaseSchema<any>>
    >(
        this: T,
        connection: PolyORMConnection
    ): InstanceType<T> {
        const included = new Set<string>()
        const database = new this(connection)

        database.push(...connection.entities.flatMap(target => {
            const meta = EntityMetadata.find(target)
            if (!meta) throw PolyORMException.Metadata.instantiate(
                "UNKNOWN_ENTITY", target.name
            )

            return [
                (this as T & typeof DatabaseSchema)
                    .TableConstructor
                    .buildFromMetadata(database, meta),

                ...(this as T & typeof DatabaseSchema)
                    .TableConstructor
                    .buildJoinTablesFromMetadata(database, meta)
            ]
        })
            .filter(({ name }) => {
                if (included.has(name)) return false

                included.add(name)
                return true
            }))

        return database as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public static async buildFromDatabase<
        T extends Constructor<DatabaseSchema<any>>
    >(
        this: T,
        connection: PolyORMConnection
    ): Promise<InstanceType<T>> {
        return new this(connection, ...await connection.query(
            databaseSchemaQuery(),
            undefined,
        )
        ) as InstanceType<T>
    }
}

export {
    TableSchema,
    ColumnSchema,
    ForeignKeyRefSchema,
    CheckConstraintSchema,
    TriggersSchema,
    TriggerSchema,

    type ActionType,
    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ColumnSchemaChild,
    type ForeignKeyRefSchemaMap
}