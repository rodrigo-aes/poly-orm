import {
    DataType,
    EntityMetadata,
    ColumnMetadata,
    JoinColumnMetadata,
    ColumnSchemaMetadata
} from "../../../Metadata"

import ForeignKeyReferencesSchema, {
    type ForeignKeyReferencesSchemaMap
} from "./ForeignKeyReferencesSchema"

// Types
import type { EntityTarget, Constructor } from "../../../types"
import type { ColumnPattern } from "../../../Metadata"
import type { ActionType } from "../../types"
import type {
    ColumnSchemaInitMap,
    ColumnSchemaMap,
    ColumnSchemaAction
} from "./types"

// Exceptions
import PolyORMException from "../../../Errors"

export default class ColumnSchema {
    /** @internal */
    public tableName!: string

    /** @internal */
    public name!: string

    /** @internal */
    public dataType!: DataType | string

    /** @internal */
    public pattern?: ColumnPattern

    /** @internal */
    public map: ColumnSchemaMap = {
        nullable: true
    }

    /** @internal */
    public actions: ColumnSchemaAction[] = []

    /** @internal */
    protected _action?: ActionType

    /** @internal */
    protected _fkAction?: ActionType

    /** @internal */
    constructor({ name, tableName, dataType, pattern, ...rest }: (
        ColumnSchemaInitMap
    )) {
        this.name = name
        this.tableName = tableName
        this.dataType = dataType
        this.pattern = pattern

        const { references, ...map } = rest
        this.map = { ...this.map, ...map }

        if (references) this.map.references = (
            references instanceof ForeignKeyReferencesSchema
        )
            ? references
            : new ForeignKeyReferencesSchema(
                this.tableName,
                this.name,
                references
            )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get foreignKeyConstraint(): ForeignKeyReferencesSchema | undefined {
        return this.map.references
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get foreignKeyName(): string {
        return this.map.references?.name ?? `fk_${this.tableName}_${this.name}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get uniqueKeyName(): string | undefined {
        return this.map.unique
            ? `${this.name}_unique_key`
            : undefined
    }


    // ------------------------------------------------------------------------

    /** @internal */
    public get polymorphicPrefix(): string {
        return ColumnSchemaMetadata.getPolymorphicPrefix(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get dependence(): string | undefined {
        if (
            this.map.isForeignKey &&
            this.map.references?.map.constrained
        ) return (
            this.map.references!.map.tableName as string
        )
    }

    // Static Getters =========================================================
    // Protecteds =============================================================
    /** @internal */
    protected static get ForeignKeyConstructor(): (
        typeof ForeignKeyReferencesSchema
    ) {
        return ForeignKeyReferencesSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make `this` primary key in table
     * @param primary - A boolean defining if is primary
     * @default true
     * @returns {this} - `this`
     */
    public primary(primary: boolean = true): this {
        this.map.primary = primary
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Make `this` nullable
     * @param primary - A boolean defining if is nullable
     * @default true
     * @returns {this} - `this`
     */
    public nullable(nullable: boolean = true): this {
        this.map.nullable = nullable
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` default value in database
     * @param value - Any value to use as default
     * @returns {this} - `this`
     */
    public default(value: any): this {
        this.map.defaultValue = value
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Make `this` auto increment
     * @param primary - A boolean defining if is auto increment
     * @default true
     * @returns {this} - `this`
     */
    public autoIncrement(autoIncrement: boolean = true): this {
        this.map.autoIncrement = autoIncrement
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Make `this` unsigned
     * @param primary - A boolean defining if is unsigned
     * @default true
     * @returns {this} - `this`
     */
    public unsigned(unsigned: boolean = true): this {
        this.map.unsigned = unsigned
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add `this` a unique index
     * @param primary - A boolean defining if is unique
     * @default true
     * @returns {this} - `this`
     */
    public unique(unique: boolean = true): this {
        this.map.unique = unique
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` as a constrained foreign key
     * @param table - Referenced foreign table
     * @param column - Referenced foreign table column
     * @returns {this} - `this`
     */
    public foreignKey(
        table: string | EntityTarget,
        column: string
    ): ForeignKeyReferencesSchema {
        this.map.isForeignKey = true
        return this.constrained().references(table, column)
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` as a constrained foreign key and returns foreign key
     * refrences shcema to handle
     * @returns {ForeignKeyReferencesSchema} - Foreign key references schema
     */
    public constrained(): ForeignKeyReferencesSchema {
        if (this.map.references) PolyORMException.MySQL.throwOutOfOperation(
            'DUPLICATE_KEY', this.foreignKeyName
        )

        this.map.isForeignKey = true
        this.map.references = new ForeignKeyReferencesSchema(
            this.tableName,
            this.name,
            {
                constrained: true
            }
        )
        this.actions.push(['CREATE', this.map.references])

        return this.map.references
    }

    // ------------------------------------------------------------------------

    /**
     * Alter `this` constraint foreign key
     * @returns {ForeignKeyReferencesSchema} - Foreign key references schema
     */
    public alterConstraint(): ForeignKeyReferencesSchema {
        if (!this.map.references) throw PolyORMException.MySQL.instantiate(
            'CANNOT_DROP_FIELD_OR_KEY', this.foreignKeyName
        )

        this.actions.push(['ALTER', this.map.references])

        return this.map.references
    }

    // ------------------------------------------------------------------------

    /**
     * Drop `this` constrained foreign key
     */
    public dropConstraint(): void {
        if (!this.map.references) throw PolyORMException.MySQL.instantiate(
            'CANNOT_DROP_FIELD_OR_KEY', this.foreignKeyName
        )

        this.actions.push(['DROP', this.map.references])
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    public compare(schema?: ColumnSchema): [ActionType, ActionType] {
        this._action = this._action ?? this.action(schema) as ActionType
        this._fkAction = this._fkAction ?? (
            schema
                ? this.foreignKeyAction(schema)
                : 'NONE'
        )

        return [this._action, this._fkAction]
    }

    // Protecteds -------------------------------------------------------------]
    /** @iternal */
    protected action(schema?: ColumnSchema): Omit<ActionType, 'DROP'> {
        switch (true) {
            case !schema: return 'CREATE';
            case this.shouldAlter(schema!): return 'ALTER'
            case this.shouldDropAndAdd(schema!): return 'DROP/CREATE'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected foreignKeyAction(schema: ColumnSchema): (
        ActionType
    ) {
        switch (true) {
            case (
                !schema.map.isForeignKey &&
                this.map.isForeignKey
            ): return 'CREATE'

            case (
                schema.map.isForeignKey &&
                !this.map.isForeignKey
            ): return 'DROP'

            case (
                !!schema.map.references &&
                !!this.map.references &&
                this.shouldAlterForeignKey(schema.map.references)
            ): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldAlter(schema: ColumnSchema): boolean {
        const { references, ...map } = this.map

        for (const [key, value] of Object.entries(map) as (
            [keyof ColumnSchemaMap, any][])
        ) if (!this.compareValues(value, schema.map[key])) return true


        return false
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldDropAndAdd(schema: ColumnSchema): boolean {
        if (!this.compareDataTypes(typeof schema.dataType === 'string'
            ? schema.map.columnType!
            : schema.dataType
        )) return true

        return false
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldAlterForeignKey(references: ForeignKeyReferencesSchema): (
        boolean
    ) {
        for (const [key, value] of Object.entries(this.map.references!) as (
            [keyof ForeignKeyReferencesSchema, string | null][]
        ))
            if (!this.compareValues(value, references[key])) return true

        return false
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected compareDataTypes(
        dataTypeA: DataType | string,
        dataTypeB: DataType | string = this.dataType
    ): boolean {
        switch (typeof dataTypeA) {
            case "string": switch (typeof dataTypeB) {
                case "string": return dataTypeA === dataTypeB
                case "object": return this.compareStrAndObjDataTypes(
                    dataTypeA,
                    dataTypeB
                )
            }
            case "object": switch (typeof dataTypeB) {
                case "string": return this.compareStrAndObjDataTypes(
                    dataTypeB,
                    dataTypeA
                )
                case "object": return (
                    dataTypeA.buildSQL() === dataTypeB.buildSQL()
                )
            }
        }
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected compareStrAndObjDataTypes(
        string: string,
        object: DataType
    ): boolean {
        return object
            .buildSQL()
            .replace(
                object.type.toUpperCase(),
                object.type
            )
            === string
                .replace('unsigned', '')
                .trim()
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected compareValues(value: any, compare: any): boolean {
        switch (typeof value) {
            case "string":
            case "number":
            case "bigint": return value === compare
            case "boolean": return value === !!compare
            case "undefined": return !compare
            case "function": return value() === compare

            default: return true
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /** @iternal */
    public static buildFromMetadata<T extends Constructor<ColumnSchema>>(
        this: T,
        metadata: ColumnMetadata | JoinColumnMetadata,
    ): InstanceType<T> {
        const { tableName, name, references, dataType } = metadata

        return new this({
            ...metadata.toJSON(),
            tableName,
            dataType,
            references: references
                ? new (this as T & typeof ColumnSchema).ForeignKeyConstructor(
                    tableName,
                    name,
                    {
                        tableName: (references.entity as EntityMetadata)
                            .tableName,

                        columnName: (references.column as ColumnMetadata)
                            .name,

                        name: references.name,
                        constrained: references.constrained,
                        onUpdate: references.onUpdate,
                        onDelete: references.onDelete
                    })

                : undefined,
        }) as InstanceType<T>
    }
}

export {
    ForeignKeyReferencesSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchemaMap
}