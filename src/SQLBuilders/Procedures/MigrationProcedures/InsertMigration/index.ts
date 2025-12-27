import Procedure from "../../Procedure"
import { DataType } from "../../../../Metadata"

// Types
import type { ProcedureArgsSchema } from "../../types"
import type { MigrationData } from "../../../../Migrator"
import type { In } from "./types"

class InsertMigration extends Procedure<MigrationData[], In, never> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get in(): ProcedureArgsSchema<In> {
        return {
            new_name: DataType.VARCHAR(),
            new_order: DataType.INT(),
            new_created_at: DataType.TIMESTAMP()
        }
    }

    // Instance Methods =======================================================
    // Protecteds ------------------------------------------------------------- 
    protected action(): string {
        return /* sql */`
            DECLARE last_order INT;

            IF new_order IS NOT NULL THEN
                UPDATE __migrations
                SET 
                    \`order\` = \`order\` + 1,
                    \`updatedAt\` = NOW()
                WHERE \`order\` >= new_order
                ORDER BY \`order\` DESC;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (
                    new_name,
                    new_order,
                    IFNULL(new_created_at, NOW()),
                    NOW()
                );

            ELSE
                SELECT COALESCE(MAX(\`order\`), 0) + 1
                INTO last_order
                FROM __migrations;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (
                    new_name,
                    last_order,
                    IFNULL(new_created_at, NOW()),
                    NOW()
                );
            END IF;

            IF new_order IS NOT NULL THEN
                SELECT \`name\`, \`order\`, \`fileName\`, \`name\` 
                FROM __migrations
                WHERE \`order\` >= new_order
                ORDER BY
                    CASE WHEN id = LAST_INSERT_ID() THEN 0 ELSE 1 END,
                    \`order\`;
            ELSE
                SELECT \`name\`, \`order\`, \`fileName\`, \`name\` 
                FROM __migrations
                WHERE id = LAST_INSERT_ID();
            END IF;
        `
    }
}

export default new InsertMigration