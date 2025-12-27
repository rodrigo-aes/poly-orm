import Procedure from "../../Procedure"
import { DataType } from "../../../../Metadata"

// Types
import type { ProcedureArgsSchema } from "../../types"
import type { In } from "./types"

class MoveMigration extends Procedure<never, In, never> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public override get in(): ProcedureArgsSchema<In> | undefined {
        return {
            from_order: DataType.INT(),
            to_order: DataType.INT()
        }
    }

    // Instance Methods =======================================================
    // Protecteds ------------------------------------------------------------- 
    public action(): string {
        return /*sql*/`
            UPDATE __migrations SET \`order\` = 0 WHERE \`order\` = from_order;

            IF from_order > to_order THEN
                UPDATE __migrations 
                    SET \`order\` = \`order\` + 1
                WHERE \`order\` >= to_order AND \`order\` < from_order
                ORDER BY \`order\` DESC;
            ELSE
                UPDATE __migrations 
                    SET \`order\` = \`order\` - 1
                WHERE \`order\` <= to_order AND \`order\` > from_order;
            END IF;

            UPDATE __migrations SET \`order\` = to_order WHERE \`order\` = 0;
        `
    }
}

export default new MoveMigration