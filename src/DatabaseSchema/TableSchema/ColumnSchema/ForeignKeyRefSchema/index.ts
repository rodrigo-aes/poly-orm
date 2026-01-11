import { EntityMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types"
import type { ForeignKeyActionListener } from "../../../../Metadata"
import type { ForeignKeyRefSchemaMap } from "./types"

export default class ForeignKeyRefSchema {
    /** @internal */
    constructor(
        public tableName: string,
        public columnName: string,

        /** @internal */
        public map: ForeignKeyRefSchemaMap = {}
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return `fk_${this.tableName}_${this.columnName}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `this` references table and column
     * @param table - referenced table name or table entity target
     * @param column - references table column name
     * @returns {this} - `this`
     */
    public references(table: EntityTarget | string, column: string): this {
        this.map.tableName = this.resolveTableName(table)
        this.map.columnName = column

        return this
    }

    // ------------------------------------------------------------------------

    public constrained(constrained: boolean = true): this {
        this.map.constrained = constrained
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` ON UPDATE action listener
     * @param {ForeignKeyActionListener} action - Action listenes
      * @returns {this} - `this`
     */
    public onUpdate(action: ForeignKeyActionListener): this {
        this.map.onUpdate = action
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` ON DELETE action listener
     * @param {ForeignKeyActionListener} action - Action listenes
      * @returns {this} - `this`
     */
    public onDelete(action: ForeignKeyActionListener): this {
        this.map.onDelete = action
        return this
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private resolveTableName(table: EntityTarget | string): string {
        switch (typeof table) {
            case 'string': return table
            case 'object': return EntityMetadata.findOrThrow(table).tableName

            default: throw new Error('Unreacheable error')
        }
    }
}

export {
    type ForeignKeyRefSchemaMap
}