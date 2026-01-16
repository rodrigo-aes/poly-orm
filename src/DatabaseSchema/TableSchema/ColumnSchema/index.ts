import {
    DataType,
    EntityMetadata,
    ColumnMetadata,
    JoinColumnMetadata,
    ColumnSchemaMetadata
} from "../../../Metadata"

import ForeignKeyRefSchema, {
    type ForeignKeyRefSchemaMap
} from "./ForeignKeyRefSchema"

import CheckConstraintSchema from "./CheckConstraintSchema"

// Types
import type { EntityTarget, Constructor } from "../../../types"
import type { ColumnPattern } from "../../../Metadata"
import type { ActionType } from "../../types"
import type {
    ColumnSchemaInitMap,
    ColumnSchemaMap,
    ColumnSchemaChild,
    ColumnSchemaAction
} from "./types"
import type { LiteralHandler } from "../../../SQLBuilders"

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
    protected _checkAction?: ActionType

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
            references instanceof ForeignKeyRefSchema
        )
            ? references
            : new ForeignKeyRefSchema(
                this.tableName,
                this.name,
                references
            )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get PKName(): string {
        return `pk_${this.tableName}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get FKSQLBuilder(): ForeignKeyRefSchema | undefined {
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
        return this.map.unique ? `${this.name}_unique_key` : undefined
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get checkName(): string | undefined {
        return this.map.check?.length ? `chk_${this.name}` : undefined
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

    // ------------------------------------------------------------------------

    /** @internal */
    public get constrainedForeignKey(): boolean {
        return !!(
            this.map.isForeignKey &&
            this.map.references?.map.constrained
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public get checkConstraint(): boolean {
        return !!this.map.check?.length
    }

    // Static Getters =========================================================
    // Protecteds =============================================================
    /** @internal */
    protected static get ForeignKeyConstructor(): (
        typeof ForeignKeyRefSchema
    ) {
        return ForeignKeyRefSchema
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
    public FK(
        table: string | EntityTarget,
        column: string
    ): ForeignKeyRefSchema {
        this.map.isForeignKey = true
        return this.addAction(
            this.validAction('CREATE', 'references'),
            new ForeignKeyRefSchema(this.tableName, this.name).references(
                table, column
            )
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Alter `this` constraint foreign key
     * @returns {ForeignKeyRefSchema} - Foreign key references schema
     */
    public alterFK(): ForeignKeyRefSchema {
        return this.addAction(
            this.validAction('ALTER', 'references'),
            this.map.references!
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Drop `this` constrained foreign key
     */
    public dropFK(): void {
        if (!this.map.references?.map.constrained) throw (
            PolyORMException.MySQL.instantiate(
                'CANNOT_DROP_FIELD_OR_KEY', this.foreignKeyName
            )
        )

        this.addAction(
            this.validAction('DROP', 'references'),
            this.map.references!
        )
    }

    // ------------------------------------------------------------------------

    public check(...constraints: (string | LiteralHandler)[]): this {
        this.addAction(
            this.validAction('CREATE', 'check'),
            (this.map.check ??= new CheckConstraintSchema(
                this.tableName, this.name, ...constraints
            ))
        )

        return this
    }

    // ------------------------------------------------------------------------

    public alterCheck(...constraints: (string | LiteralHandler)[]): this {
        this.addAction(
            this.validAction('ALTER', 'check'),
            this.map.check = new CheckConstraintSchema(
                this.tableName, this.name, ...constraints
            )
        )

        return this
    }

    // ------------------------------------------------------------------------

    public dropCheck(): this {
        this.addAction(
            this.validAction('DROP', 'check'),
            this.map.check!
        )

        return this
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    public compare(schema?: ColumnSchema): [ActionType, ActionType[]] {
        return [
            this._action ??= this.action(schema) as ActionType,
            [
                this._fkAction ??= schema
                    ? this.FKAction(schema)
                    : 'NONE',

                this._checkAction ??= schema
                    ? this.checkAction(schema)
                    : 'NONE'
            ]
        ]
    }

    // Protecteds -------------------------------------------------------------]
    /** @iternal */
    protected action(schema?: ColumnSchema): Omit<ActionType, 'DROP'> {
        switch (true) {
            case !schema: return 'CREATE';
            case this.shouldAlter(schema!): return 'ALTER'
            case this.shouldRebuild(schema!): return 'DROP/CREATE'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected FKAction(schema: ColumnSchema): ActionType {
        switch (true) {
            case (
                !schema.map.isForeignKey &&
                this.map.isForeignKey
            ): return (
                'CREATE'
            )

            // ----------------------------------------------------------------

            case (
                schema.map.isForeignKey &&
                !this.map.isForeignKey
            ): return (
                'DROP'
            )

            // ----------------------------------------------------------------

            case (
                schema.map.references &&
                this.map.references &&
                this.shouldAlterForeignKey(schema.map.references)
            ): return (
                'ALTER'
            )

            // ----------------------------------------------------------------

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    protected checkAction(schema: ColumnSchema): ActionType {
        switch (true) {
            case (
                !schema.map.check?.length &&
                !!this.map.check?.length
            ): return (
                'CREATE'
            )

            // ----------------------------------------------------------------

            case (
                this.map.check?.length !== schema.map.check?.length ||
                this.map.check?.some(c => !schema.map.check?.includes(c))
            ): return (
                'ALTER'
            )

            // ----------------------------------------------------------------

            case (
                !!schema.map.check?.length &&
                !this.map.check?.length
            ): return (
                'DROP'
            )

            // ----------------------------------------------------------------

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldAlter(schema: ColumnSchema): boolean {
        return Object
            .entries(this.map)
            .filter(([key]) => key !== 'references')
            .some(([key, value]) => !this.compareValues(
                value, schema.map[key as keyof ColumnSchemaMap]
            ))
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldRebuild(schema: ColumnSchema): boolean {
        return !DataType.same(
            typeof schema.dataType === 'object'
                ? schema.dataType
                : schema.map.columnType!,

            this.dataType
        )
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    protected shouldAlterForeignKey(references: ForeignKeyRefSchema): (
        boolean
    ) {
        for (const [key, value] of Object.entries(this.map.references!) as (
            [keyof ForeignKeyRefSchema, string | null][]
        ))
            if (!this.compareValues(value, references[key])) return true

        return false
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

    // Privates ---------------------------------------------------------------
    /** @iternal */
    private addAction<T extends ColumnSchemaChild>(
        action: ActionType,
        child: T
    ): T {
        this.actions.push([action, child])
        return child
    }

    // ------------------------------------------------------------------------

    /** @iternal */
    private validAction(
        action: ActionType,
        key: keyof ColumnSchemaMap
    ): ActionType {
        switch (action) {
            case "CREATE": return !this.map[key]
                ? action
                : PolyORMException.MySQL.throwOutOfOperation(
                    'DUPLICATE_KEY', this.foreignKeyName
                ) as any

            // ----------------------------------------------------------------

            case "ALTER":
            case "DROP": return this.map[key]
                ? action
                : (() => {
                    throw PolyORMException.MySQL.instantiate(
                        'CANNOT_DROP_FIELD_OR_KEY', this.foreignKeyName
                    )
                })()

            // ----------------------------------------------------------------

            default: throw new Error('Unreacheable error')
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
    ForeignKeyRefSchema,
    CheckConstraintSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ColumnSchemaChild,
    type ForeignKeyRefSchemaMap
}