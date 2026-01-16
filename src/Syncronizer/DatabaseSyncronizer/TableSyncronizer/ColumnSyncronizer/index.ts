import { ColumnSQLBuilder } from "../../../../SQLBuilders"
import type { ColumnSchema } from "../../../../DatabaseSchema"

export default class ColumnSyncronizer extends ColumnSQLBuilder {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------W
    public actionSQL(schema?: ColumnSchema): string | undefined {
        switch (this.compare(schema)[0]) {
            case 'CREATE': return this.addSQL()
            case 'ALTER': return this.alterSQL(schema)
            case "REBUILD": return this.rebuildSQL()
            case 'DROP': return this.dropSQL()
        }
    }

    // Privates ---------------------------------------------------------------
    private alterSQL(schema?: ColumnSchema) {
        return (
            this.dropConstraintsSQL(schema) +
            this.modifySQL() +
            this.createConstraintsSQL()
        )
    }
}