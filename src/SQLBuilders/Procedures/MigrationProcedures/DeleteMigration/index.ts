import Procedure from "../../Procedure"
import { DataType } from "../../../../Metadata"

// Types
import type { ProcedureArgsSchema } from "../../types"
import type { In, Out } from "./types"

class DeleteMigration extends Procedure<
    never, In, Out
> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get in(): ProcedureArgsSchema<In> {
        return {
            unique_identifier: DataType.VARCHAR()
        }
    }

    // ------------------------------------------------------------------------

    protected override get out(): ProcedureArgsSchema<Out> {
        return {
            deleted_order: DataType.INT()
        }
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    protected action(): string {
        return /* sql */`
            SELECT \`order\` INTO deleted_order FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier
                OR (
                    unique_identifier REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST(unique_identifier AS UNSIGNED)
                );

            DELETE FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier
                OR (
                    unique_identifier REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST(unique_identifier AS UNSIGNED)
                );

            UPDATE __migrations 
                SET \`order\` = \`order\` - 1
                WHERE \`order\` > deleted_order;
        `
    }
}

export default new DeleteMigration