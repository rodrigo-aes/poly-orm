import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity, Constructor } from "../../../../types"
import type { DeleteSQLBuilder } from "../../../../SQLBuilders"
import type { ExecOptions } from "../types"
import type { DeleteResult } from "./types"

export default class DeleteOperation extends OperationHandler {
    public static readonly fillMethod = 'One'

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Hooks.Delete
    public static async exec<
        T extends Entity,
        B extends DeleteSQLBuilder<T>
    >({
        target,
        sqlBuilder,
    }: ExecOptions<T, B, never>): Promise<DeleteResult> {
        const { affectedRows, serverStatus } = await this.execQuery(
            target, sqlBuilder
        )

        return { affectedRows, serverStatus }
    }
}

export type {
    DeleteResult
}
