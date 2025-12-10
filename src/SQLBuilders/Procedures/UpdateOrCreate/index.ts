import Procedure from "../Procedure"
import { DataType } from "../../../Metadata"

// Types
import type { ProcedureArgsSchema } from "../types"
import type { In } from "./types"

class UpdateOrCreate<T extends any[] = any[]> extends Procedure<
    T, In, never
> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get in(): ProcedureArgsSchema<In> {
        return {
            insertSQL: DataType.TEXT(),
            selectSQL: DataType.TEXT()
        }
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected proccessSQL(): string {
        return `
            SET @query = insertSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;

            SET @query = selectSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        `
    }

    // ------------------------------------------------------------------------

    protected override callInArgsSQL(...args: In[1]): string[] {
        return args.map(arg => `"${arg}"`)
    }
}

export default new UpdateOrCreate