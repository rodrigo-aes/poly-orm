import Procedure from "../Procedure"
import { DataType } from "../../../Metadata"

// Types
import type { ProcedureArgsSchema } from "../types"
import type { In } from "./types"

class SyncManyToMany extends Procedure<never, In, never> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get in(): ProcedureArgsSchema<In> {
        return {
            insertSQL: DataType.TEXT(),
            deleteSQL: DataType.TEXT()
        }
    }

    // Instance Methods =======================================================
    // Protecteds --------------------------------------------------------------
    protected action(): string {
        return /*sql*/`
            SET @query = insertSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;

            IF deleteSQL IS NOT NULL AND deleteSQL != '' THEN
                SET @query = deleteSQL;
                PREPARE stmt FROM @query;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
            END IF;
        `
    }
}

export default new SyncManyToMany