import ColumnSchema, {
    ForeignKeyRefSchema,
    CheckConstraintSchema,

    type ColumnSchemaChild
} from "../../../../DatabaseSchema/TableSchema/ColumnSchema"

// Metadata
import { DataType } from "../../../../Metadata"

// SQL Builders
import ForeignKeyConstraintSQLBuilder from "./ForeignKeyConstraintSQLBuilder"
import CheckConstraintSQLBuilder from "./CheckConstraintSQLBuilder"

// Symbols
import { PolymorphicId, CurrentTimestamp } from "./Symbols"

// Helpers
import { SQLString } from "../../../../Handlers"

// Types
import type { ColumnSQLBuilderMap, ColumnSQLBuilderChild } from "./types"

export default class ColumnSQLBuilder extends ColumnSchema {
    declare public map: ColumnSQLBuilderMap

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get FKSQLBuilder(): (
        ForeignKeyConstraintSQLBuilder | undefined
    ) {
        return this.map.references
    }

    // ------------------------------------------------------------------------

    public get CHKSQLBuilder(): (
        CheckConstraintSQLBuilder | undefined
    ) {
        return this.map.check
    }

    // Static Getters =========================================================
    // Protecteds =============================================================
    protected static get ForeignKeyConstructor(): (
        typeof ForeignKeyConstraintSQLBuilder
    ) {
        return ForeignKeyConstraintSQLBuilder
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        return this.columnSQL() + this.createConstraintsSQL()
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        return 'ADD COLUMN ' + this.columnSQL() + this.createConstraintsSQL(
            true
        )
    }

    // ------------------------------------------------------------------------

    public rebuildSQL(): string {
        return `${this.dropSQL()}, ${this.addSQL()}`
    }



    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return this.dropConstraintsSQL() + `DROP COLUMN \`${this.name}\``
    }

    // ------------------------------------------------------------------------

    public PKConstraintSQL() {
        return `CONSTRAINT ${this.PKName} PRIMARY KEY (${this.name})`
    }

    // ------------------------------------------------------------------------

    public addPKSQL() {
        return 'ADD ' + this.PKConstraintSQL()
    }

    // ------------------------------------------------------------------------

    public dropPKSQL() {
        return 'DROP PRIMARY KEY'
    }

    // ------------------------------------------------------------------------

    public uniqueConstraintSQL(): string {
        return `UNIQUE KEY ${this.uniqueKeyName} (\`${this.name}\`)`
    }

    // ------------------------------------------------------------------------

    public addUniqueSQL(): string {
        return 'ADD ' + this.uniqueConstraintSQL()
    }

    // ------------------------------------------------------------------------

    public dropUniqueSQL(): string {
        return 'DROP INDEX ' + this.uniqueKeyName
    }

    // Protecteds -------------------------------------------------------------
    protected modifySQL() {
        return 'MODIFY COLUMN ' + this.columnSQL()
    }

    // ------------------------------------------------------------------------

    protected createConstraintsSQL(add: boolean = false): string {
        const constraints: string[] = []

        // Primary ------------------------------------------------------------
        if (this.map.primary) constraints.push(
            this[add ? 'addPKSQL' : 'PKConstraintSQL']()
        )

        // Unique ------------------------------------------------------------
        if (this.map.unique) constraints.push(
            this[add ? 'addUniqueSQL' : 'uniqueConstraintSQL']()
        )

        // Foreign Key --------------------------------------------------------
        if (this.constrainedForeignKey) constraints.push(
            this.FKSQLBuilder![add ? 'addSQL' : 'createSQL']()
        )

        // Check ------------------------------------------------------------
        if (this.checkConstraint) constraints.push(
            this.map.check![add ? 'addSQL' : 'createSQL']()
        )

        // --------------------------------------------------------------------

        return constraints.join(', ')
    }

    // ------------------------------------------------------------------------

    protected dropConstraintsSQL(schema?: ColumnSchema): string {
        const constraints: string[] = []

        // Primary ------------------------------------------------------------
        if ((schema?.map ?? this.map).primary) constraints.push(
            this.dropPKSQL()
        )

        // Unique -------------------------------------------------------------
        if ((schema?.map ?? this.map).unique) constraints.push(
            this.dropUniqueSQL()
        )

        // Foreign Key --------------------------------------------------------
        if ((schema ?? this).constrainedForeignKey) constraints.push(
            this.FKSQLBuilder!.dropSQL()
        )

        // Check ------------------------------------------------------------
        if ((schema?.map ?? this.map).check) constraints.push(
            this.map.check!.dropSQL()
        )

        // --------------------------------------------------------------------

        return constraints.join(', ') + constraints.length ? ', ' : ''
    }

    // ------------------------------------------------------------------------

    protected childSQLBuilder(
        child: ColumnSchemaChild
    ): ColumnSQLBuilderChild | undefined {
        switch (true) {
            case child instanceof ForeignKeyRefSchema: return (
                this.FKSQLBuilder
            )

            // ----------------------------------------------------------------

            case child instanceof CheckConstraintSchema: return (
                this.CHKSQLBuilder
            )

            // ----------------------------------------------------------------

            default: throw new Error('Unreacheable error')
        }
    }

    // Privates ---------------------------------------------------------------
    private columnSQL() {
        return `${this.nameSQL()} ${this.typeSQL()} ${this.unsignedSQL()} ${(
            this.nullSQL()
        )} ${this.autoIncrementSQL()} ${this.defaultSQL()}`
    }

    // ------------------------------------------------------------------------

    private nameSQL() {
        return `\`${this.name}\``
    }

    // ------------------------------------------------------------------------

    private typeSQL() {
        if (!DataType.isDataType(this.dataType)) throw new Error
        return (this.dataType as DataType).buildSQL()
    }

    // ------------------------------------------------------------------------

    private unsignedSQL() {
        return this.map.unsigned ? 'UNSIGNED' : ''
    }

    // ------------------------------------------------------------------------

    private nullSQL() {
        return this.map.nullable ? 'NULL' : 'NOT NULL'
    }

    // ------------------------------------------------------------------------

    private autoIncrementSQL() {
        return this.map.autoIncrement ? 'AUTO_INCREMENT' : ''
    }

    // ------------------------------------------------------------------------

    private defaultSQL() {
        switch (typeof this.map.defaultValue) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "object": return (
                `DEFAULT ${SQLString.value(this.map.defaultValue)}`
            )

            case "symbol": switch (this.map.defaultValue) {
                case CurrentTimestamp: return 'DEFAULT CURRENT_TIMESTAMP'
            }

            default: return ''
        }
    }



    // ------------------------------------------------------------------------


}

export {
    ForeignKeyConstraintSQLBuilder,
    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap,
    type ColumnSQLBuilderChild
}