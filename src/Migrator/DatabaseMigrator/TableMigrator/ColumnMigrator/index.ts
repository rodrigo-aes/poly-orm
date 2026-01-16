import { ColumnSQLBuilder } from "../../../../SQLBuilders"

// Types
import type { ColumnSchema, ActionType } from "../../../../DatabaseSchema"

export default class ColumnMigrator extends ColumnSQLBuilder {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public alterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return `${this.modifySQL()}, ${(
                this.alterChildSQL()
            )}`

            // ----------------------------------------------------------------

            case 'REBUILD': return this.rebuildSQL()

            // ----------------------------------------------------------------

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private alterChildSQL(): string {
        return this.actions.map(([action, child]) => {
            switch (action) {
                case "CREATE": return (
                    this.childSQLBuilder(child)?.addSQL() ?? ''
                )

                // ------------------------------------------------------------

                case "ALTER": return (
                    this.childSQLBuilder(child)?.alterSQL() ?? ''
                )

                // ------------------------------------------------------------

                case "DROP": return (
                    this.childSQLBuilder(child)?.dropSQL() ?? ''
                )
            }
        })
            .join(', ')
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(schema: ColumnSchema): ColumnMigrator {
        const { tableName, name, dataType, map, actions } = schema

        const migrator = new ColumnMigrator({
            tableName,
            name,
            dataType,
            ...map
        })

        migrator.actions = actions

        return migrator
    }
}