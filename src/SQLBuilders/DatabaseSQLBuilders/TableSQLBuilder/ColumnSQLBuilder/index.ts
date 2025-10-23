import ColumnSchema from "../../../../DatabaseSchema/TableSchema/ColumnSchema"

// Metadata
import { DataType } from "../../../../Metadata"

// SQL Builders
import ForeignKeyConstraintSQLBuilder from "./ForeignKeyConstraintSQLBuilder"

// Symbols
import { PolymorphicId, CurrentTimestamp } from "./Symbols"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../../Helpers"

// Types
import type { ActionType } from "../../../../DatabaseSchema"
import type { ColumnSQLBuilderMap } from "./types"

export default class ColumnSQLBuilder extends ColumnSchema {
    declare public map: ColumnSQLBuilderMap

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get foreignKeyConstraint(): (
        ForeignKeyConstraintSQLBuilder | undefined
    ) {
        return this.map.references
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
        return SQLStringHelper.normalizeSQL(`
            ${this.columnSQL('CREATE')}${this.createForeignKeySQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public createForeignKeySQL() {
        return this.foreignKeyConstraint?.map.constrained
            ? `, ${this.foreignKeyConstraint?.createSQL()}`
            : ''
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        return SQLStringHelper.normalizeSQL(
            `ADD COLUMN ${this.columnSQL('CREATE')}${this.addForeignKeySQL()}`
        )
    }

    // ------------------------------------------------------------------------

    public addForeignKeySQL() {
        return this.foreignKeyConstraint?.map.constrained
            ? `, ${this.foreignKeyConstraint?.addSQL()}`
            : ''
    }

    // ------------------------------------------------------------------------

    public alterSQL() {
        return SQLStringHelper.normalizeSQL(`
            MODIFY COLUMN ${this.columnSQL('ALTER')}
        `)
    }

    // ------------------------------------------------------------------------

    public dropAndAddSQL(): string {
        return `${this.dropSQL()}, ${this.addSQL()}${this.addForeignKeySQL()}`
    }

    // ------------------------------------------------------------------------

    public alterForeignKeySQL(): string {
        return this.foreignKeyConstraint?.alterSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public syncAlterSQL(schema?: ColumnSchema) {
        const sql: string[] = []

        const { primary: oldPk, unique: oldUn } = schema?.map ?? this.map
        const { primary, unique } = this.map

        if (oldPk ?? primary) sql.push(this.dropIndexSQL('PRIMARY'))
        if (oldUn ?? unique) sql.push(this.dropIndexSQL('UNIQUE'))

        sql.push(this.alterSQL())

        if (primary) sql.push(this.addIndexSQL('PRIMARY'))
        if (unique) sql.push(this.addIndexSQL('UNIQUE'))

        const fkSQL = schema ? this.syncForeignKeyActionSQL(schema) : undefined
        if (fkSQL) sql.push(fkSQL)

        return SQLStringHelper.normalizeSQL(sql.join(', '))
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.shouldDropForeignKeySQL()} DROP COLUMN \`${this.name}\``
        )
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL(): string {
        return this.foreignKeyConstraint?.dropSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public addIndexSQL(index: 'PRIMARY' | 'UNIQUE'): string {
        switch (index) {
            case "PRIMARY": return `ADD PRIMARY KEY (${this.name})`
            case "UNIQUE": return (
                `ADD UNIQUE KEY ${this.uniqueKeyName} (${this.name})`
            )
        }
    }

    // ------------------------------------------------------------------------

    public dropIndexSQL(index: 'PRIMARY' | 'UNIQUE'): string {
        switch (index) {
            case "PRIMARY": return 'DROP PRIMARY KEY'
            case "UNIQUE": return (
                `DROP INDEX ${this.uniqueKeyName}`
            )
        }
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: ColumnSchema): string | undefined {
        switch (this.compare(schema)[0]) {
            case 'CREATE': return this.addSQL()
            case 'ALTER': return this.syncAlterSQL()
            case "DROP/CREATE": return this.dropAndAddSQL()
            case 'DROP': return this.dropSQL()
        }
    }

    // ------------------------------------------------------------------------

    public syncForeignKeyActionSQL(schema: ColumnSchema): string {
        switch (this.foreignKeyAction(schema)) {
            case 'CREATE': return this.addForeignKeySQL()
            case 'ALTER': return this.alterForeignKeySQL()
            case 'DROP': return this.dropForeignKeySQL()

            default: return ''
        }
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return [
                this.alterSQL(),
                this.childMigrateAlterSQL()
            ]
                .join(', ')

            case 'DROP/CREATE': this.dropAndAddSQL()

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // Protecteds -------------------------------------------------------------
    protected childMigrateAlterSQL(): string {
        return this.actions.map(([action]) => {
            switch (action) {
                case "CREATE": return this.addForeignKeySQL()
                case "ALTER": return this.alterForeignKeySQL()
                case "DROP": return this.dropForeignKeySQL()
            }
        })
            .join(', ')
    }

    // Privates ---------------------------------------------------------------
    private shouldDropForeignKeySQL(): string {
        return this.map.isForeignKey
            ? `${this.dropForeignKeySQL()},`
            : ''
    }

    // ------------------------------------------------------------------------

    private columnSQL(action: 'CREATE' | 'ALTER') {
        const create: boolean = action === 'CREATE'

        return [
            this.nameSQL(),
            this.typeSQL(),
            this.unsignedSQL(),
            create ? this.primarySQL() : '',
            this.nullSQL(),
            this.autoIncrementSQL(),
            this.defaultSQL(),
            create ? this.uniqueSQL() : '',
        ].join(' ')
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

    private uniqueSQL() {
        return this.map.unique
            ? `, UNIQUE KEY ${this.uniqueKeyName} (\`${this.name}\`)`
            : ''
    }

    // ------------------------------------------------------------------------

    private primarySQL() {
        return this.map.primary ? 'PRIMARY KEY' : ''
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
                `DEFAULT ${PropertySQLHelper.valueSQL(this.map.defaultValue)}`
            )

            case "symbol": switch (this.map.defaultValue) {
                case CurrentTimestamp: return 'DEFAULT CURRENT_TIMESTAMP'
                case PolymorphicId: return `DEFAULT (CONCAT('${(
                    this.polymorphicPrefix
                )}_', UUID()))`
            }

            default: return ''
        }
    }
}

export {
    ForeignKeyConstraintSQLBuilder,
    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap
}