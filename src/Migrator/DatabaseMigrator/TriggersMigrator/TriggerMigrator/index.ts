import { TriggerSchema } from "../../../../DatabaseSchema"

// Types
import type { PolyORMConnection } from "../../../../Metadata"
import type { ActionType } from "../../../../DatabaseSchema"

export default class TriggerMigrator extends TriggerSchema<any> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.dropSQL())
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.alterSQL())
    }

    // ------------------------------------------------------------------------

    public async drop(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public executeAction(action: ActionType, connection: PolyORMConnection): (
        Promise<void>
    ) {
        switch (action) {
            case "CREATE": return this.create(connection)
            case "ALTER": return this.alter(connection)
            case "DROP": return this.drop(connection)

            default: throw new Error
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(schema: TriggerSchema): TriggerMigrator {
        return new TriggerMigrator({
            tableName: schema.tableName,
            name: schema.name,
            event: schema.event,
            timing: schema.timing,
            orientation: schema.orientation,
            action: schema.actionBodySQL()
        })
    }
}