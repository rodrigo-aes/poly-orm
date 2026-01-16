import {
    EntityMetadata,
    DataType,
    ColumnSchemaMetadata,

    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
} from "../../Metadata"

import ColumnSchema, {
    ForeignKeyRefSchema,
    CheckConstraintSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaChild,
    type ColumnSchemaMap,
    type ForeignKeyRefSchemaMap
} from "./ColumnSchema"

// Symbols
import { PolymorphicId, CurrentTimestamp } from "../../SQLBuilders"

// Types
import type { EntityTarget, Constructor } from "../../types"
import type DatabaseSchema from ".."
import type { ActionType } from ".."
import type { TriggerSchema } from "../TriggersSchema"
import type {
    TableSchemaInitMap,
    TableSchemaAction,
    TableSchemaActionType
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class TableSchema<
    T extends ColumnSchema = ColumnSchema
> extends Array<T> {
    /** @internal */
    public dependencies: string[]

    /** @internal */
    public actions: TableSchemaAction[] = []

    /** @internal */
    constructor(
        /** @internal */
        public database: DatabaseSchema | undefined = undefined,

        /** @internal */
        public name: string,

        ...columns: (T | Omit<ColumnSchemaInitMap, 'tableName'>)[]
    ) {
        super(...columns.map(col => col instanceof ColumnSchema
            ? col
            : new ColumnSchema({
                ...col,
                tableName: name
            }) as T
        ))

        this.dependencies = this.flatMap(({ dependence }) => dependence ?? [])
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static get ColumnConstructor(): typeof ColumnSchema {
        return ColumnSchema
    }

    // Satatic Getters ========================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a id primary column
     * @param name - Optional id name
     * @default - 'id'
     */
    public id(name?: string): void {
        this.addColumn(name ?? 'id', DataType.INT('BIG'))
            .primary()
            .unsigned()
            .autoIncrement()
    }

    // ------------------------------------------------------------------------
    /**
     * Create a polymorphic id primary column
     * @param target - Table entity
     * @param name - Optional id name
     * @default - 'id'
     */
    public polymorphicId(target: EntityTarget | string, name?: string): void {
        ColumnSchemaMetadata.setPolymorphicPrefix(
            this.addColumn(name ?? 'id', DataType.VARCHAR())
                .unique()
                .default(PolymorphicId),

            typeof target === 'string' ? target : target.name
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Create a foreign id column and returns 
     * @param name - Column name
     * @returns {ColumnSchema} - Foreign id column to handle
     */
    public foreignId(name: string): T {
        const col = this.addColumn(name, DataType.INT('BIG')).unsigned()
        col.map.isForeignKey = true

        return col
    }

    // ------------------------------------------------------------------------

    /**
     * Create a constrained foreign id for a entity
     * @param target - Target entity
     * @param name - Optional custom name
     * @default - `${target.name.toLowerCase()}_id`
     * @returns {ForeignKeyRefSchema} - Foreign key references schema to
     * handle
     */
    public foreignIdFor(
        target: EntityTarget,
        name?: string
    ): ForeignKeyRefSchema {
        const pk = EntityMetadata.findOrThrow(target).columns.primary

        return this
            .addColumn(
                name ?? `${target.name.toLowerCase()}Id`,
                pk.dataType
            )
            .unsigned()
            .FK(target, pk.name)
    }

    // ------------------------------------------------------------------------

    /**
     * Create a polymorphic foreign id column
     * @param name - Column name
     * @returns {ColumnSchema} - Polymorphic foreign id column
     */
    public polymorphicForeignId(name: string): T {
        const col = this.addColumn(name, DataType.VARCHAR())
        col.map.isForeignKey = true

        return col
    }

    // ------------------------------------------------------------------------

    /**
     * Create a polymorphic type key column
     * @param name - Column name
     * @param referenceds - Entity targets to refences column type enum
     * @returns {ColumnSchema} - Polymorphoic typekey column
     */
    public polymorphicTypeKey(
        name: string,
        ...referenceds: EntityTarget[]
    ): T {
        return this.addColumn(name, DataType.ENUM(
            ...referenceds.map(type => type.name)
        ))
    }

    // ------------------------------------------------------------------------

    /**
     * Create `createdAt` column timestamp
     */
    public createdTimestamp(): void {
        this
            .addColumn('createdAt', DataType.TIMESTAMP())
            .default(CurrentTimestamp)
    }

    // ------------------------------------------------------------------------

    /**
     * Create `updatedAt` column timestamp
     */
    public updatedTimestamp(): void {
        this
            .addColumn('updatedAt', DataType.TIMESTAMP())
            .default(CurrentTimestamp)
    }

    // ------------------------------------------------------------------------

    /**
     * Create `createdAt` and `updatedAt` timestamps columns
     */
    public timestamps(): void {
        this.createdTimestamp()
        this.updatedTimestamp()
    }

    // ------------------------------------------------------------------------

    /**
     * Create a column with name and data type
     * @param name - Column name
     * @param {DataType} dataType - Data type
     * @returns - Created column
     */
    public column(name: string, dataType: DataType): T {
        return this.addColumn(name, dataType)
    }

    // ------------------------------------------------------------------------

    /**
     * Create a VARCHAR type column
     * @param name - Column name
     * @param length - String max length
     * @returns - Created string column
     */
    public string(name: string, length?: number): T {
        return this.addColumn(name, DataType.VARCHAR(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a CHAR type column
     * @param name - Column name
     * @param length - Char max length
     * @returns - Created char column
     */
    public char(name: string, length?: number): T {
        return this.addColumn(name, DataType.CHAR(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a TEXT type column
     * @param name - Column name
     * @param {TextLength} length - TEXT column size 
     * @returns - Created text column
     */
    public text(name: string, length?: TextLength): T {
        return this.addColumn(name, DataType.TEXT(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a INT type column
     * @param name - Column name
     * @param {IntegerLength} length - INT column size
     * @returns - Created int column
     */
    public int(name: string, length?: IntegerLength): T {
        return this.addColumn(name, DataType.INT(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a BIGINT type column
     * @param name - Column name
     * @returns - Create bigint column
     */
    public bigint(name: string): T {
        return this.addColumn(name, DataType.INT('BIG'))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a TINYINT type column
     * @param name - Column name
     * @returns - Created tinyint column
     */
    public tinyint(name: string): T {
        return this.addColumn(name, DataType.INT('TINY'))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a FLOAT type column
     * @param name - Column name
     * @param M - Precision
     * @param D - Scale
     * @returns - Created float column
     */
    public float(name: string, M: number, D: number): T {
        return this.addColumn(name, DataType.FLOAT(M, D))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a DECIMAL type column
     * @param name - Column name
     * @param M - Precision
     * @param D - Scale
     * @returns - Created decimal column
     */
    public decimal(name: string, M: number, D: number): T {
        return this.addColumn(name, DataType.DECIMAL(M, D))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a DOUBLE type column
     * @param name - Column name
     * @param M - Precision
     * @param D - Scale
     * @returns - Created double column
     */
    public double(name: string, M: number, D: number): T {
        return this.addColumn(name, DataType.DOUBLE(M, D))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a BOOLEAN type column
     * @param name - Column name
     * @returns - Created boolean column
     */
    public boolean(name: string): T {
        return this.addColumn(name, DataType.BOOLEAN())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a ENUM type column
     * @param name - Column name
     * @param options - Array with enum options
     * @returns - Created enum column
     */
    public enum(name: string, options: string[]): T {
        return this.addColumn(name, DataType.ENUM(...options))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a SET type column
     * @param name - Column name
     * @param options - Array with set options
     * @returns - Created set column
     */
    public set(name: string, options: string[]): T {
        return this.addColumn(name, DataType.SET(...options))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a TIMESTAMP type column
     * @param name - Column name
     * @returns - Created timestamp column
     */
    public timestamp(name: string): T {
        return this.addColumn(name, DataType.TIMESTAMP())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a DATETIME type column
     * @param name - Column name
     * @returns - Created datetime column
     */
    public datetime(name: string): T {
        return this.addColumn(name, DataType.DATETIME())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a DATE type column
     * @param name - Column name
     * @returns - Created date column
     */
    public date(name: string): T {
        return this.addColumn(name, DataType.DATE())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a TIME type column
     * @param name - Column name
     * @returns - Created time column
     */
    public time(name: string): T {
        return this.addColumn(name, DataType.TIME())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a YEAR type column
     * @param name - Column name
     * @returns - Created year column
     */
    public year(name: string): T {
        return this.addColumn(name, DataType.YEAR())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a JSON type column
     * @param name - Column name
     * @returns - Created json column
     */
    public json(name: string): T {
        return this.addColumn(name, DataType.JSON())
    }

    // ------------------------------------------------------------------------

    /**
     * Create a VIRTUAL or STORED reference column to a JSON column in table
     * @param name - Column name
     * @param dataType - Data type of reference
     * @param {JSONColumnConfig} config - Config of the reference
     * @returns - Create json reference column
     */
    public jsonRef(
        name: string,
        dataType: DataType,
        config: JSONColumnConfig
    ): T {
        return this.addColumn(name, DataType.JSONRef(dataType, config))
    }

    // ------------------------------------------------------------------------

    /**
     * Create BIT type column
     * @param name - Column name
     * @param {BitLength} length - Size of bit 
     * @returns - Created bit column
     */
    public bit(name: string, length?: BitLength): T {
        return this.addColumn(name, DataType.BIT(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a BINARY type column
     * @param name - Column name
     * @param length - Length of binary data
     * @returns - Created binary column
     */
    public binary(name: string, length: number): T {
        return this.addColumn(name, DataType.BINARY(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a VARBINARY type column
     * @param name - Column name
     * @param length - Length of varbinary data
     * @returns - Created varbinary column
     */
    public varbinary(name: string, length: number): T {
        return this.addColumn(name, DataType.VARBINARY(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create BLOB type column
     * @param name - Colum name
     * @param {BlobLength} length - Size of blob data 
     * @returns - Created blob column
     */
    public blob(name: string, length?: BlobLength): T {
        return this.addColumn(name, DataType.BLOB(length))
    }

    // ------------------------------------------------------------------------

    /**
     * Create a computed VIRTUAL or STORED column
     * @param name - Column name
     * @param {DataType} dataType - Data type of column
     * @param as - a SQL string to handle column value on INSERT/UPDATE 
     * case `STORED` or SELECT case `VITRTUAL`
     * @param type - `VIRTUAL` or `STORED` type
     * @returns - Created computed column
     */
    public computed(
        name: string,
        dataType: DataType,
        as: string,
        type: ComputedType
    ): T {
        return this.addColumn(name, DataType.COMPUTED(dataType, as, type))
    }

    // ------------------------------------------------------------------------

    /**
     * Alter a existent column in table
     * @param name - Column name
     * @returns - Column to handle modify changes
     */
    public alterColumn(name: string): T {
        return this.addAction('ALTER', this.findOrThrow(name))
    }

    // ------------------------------------------------------------------------

    /**
     * Drop a existent column in table
     * @param name - Column name
     */
    public dropColumn(name: string): void {
        this.addAction('DROP', this.findOrThrow(name))
    }

    // ------------------------------------------------------------------------

    /**
     * Find a column by name and returns
     * @param columnName - Column name
     * @returns {ColumnSchema | undefined} - The column case exists or
     * `undefined`
     */
    public search(columnName: string): T | undefined {
        return this.find(col => col.name === columnName)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public compare(schema?: TableSchema): Omit<ActionType, 'DROP'> {
        switch (true) {
            case !schema: return 'CREATE'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected addColumn(name: string, dataType: DataType): T {
        return this.addAction(
            'CREATE',
            this.add(new ColumnSchema({
                tableName: this.name,
                name,
                dataType
            }) as T)
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected addTrigger(name: string): TriggerSchema {
        return this.database!.createTrigger(this.name, name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected shouldAlter(schema: TableSchema): boolean {
        return this
            .some(column => column
                .compare(schema.search(column.name))
                .some(action =>
                    typeof action === 'string'
                        ? action !== 'NONE'
                        : action.some(action => action !== 'NONE')
                )
            )
            || schema.some(({ name }) => !this.search(name))
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected findOrThrow(name: string): T {
        return this.search(name)!
            ?? PolyORMException.MySQL.throwOutOfOperation(
                'UNKNOW_COLUMN', name, this.name
            )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private add(column: T): T {
        this.push(column)
        return column
    }

    // ------------------------------------------------------------------------
    /** @internal */
    private addAction(action: TableSchemaActionType, column: T): T {
        this.actions.push([action, column])
        return column
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public static buildFromMetadata<T extends Constructor<TableSchema>>(
        this: T,
        database: DatabaseSchema,
        source: EntityMetadata | EntityTarget
    ): InstanceType<T> {
        const { target, tableName, columns } = (
            (this as T & typeof TableSchema).metadataFromSource(source)
        )

        return new this(database, tableName, ...columns.map(column => {
            const schema = (this as T & typeof TableSchema)
                .ColumnConstructor
                .buildFromMetadata(column)

            if (column.pattern === 'polymorphic-id') (
                ColumnSchemaMetadata.setPolymorphicPrefix(schema, target.name)
            )

            return schema
        })) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public static buildJoinTablesFromMetadata(
        database: DatabaseSchema,
        source: EntityMetadata | EntityTarget
    ): TableSchema[] {
        return this.metadataFromSource(source).joinTables?.map(
            ({ name: tableName, columns }) => new this(
                database,
                tableName,
                ...columns.map(column => this.ColumnConstructor
                    .buildFromMetadata(column)
                )
            )
        )
            ?? []
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private static metadataFromSource(source: EntityMetadata | EntityTarget) {
        const metadata = source instanceof EntityMetadata
            ? source
            : EntityMetadata.findOrThrow(source)

        return metadata
    }
}

export {
    ColumnSchema,
    ForeignKeyRefSchema,
    CheckConstraintSchema,

    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaChild,
    type ColumnSchemaMap,
    type ForeignKeyRefSchemaMap
}