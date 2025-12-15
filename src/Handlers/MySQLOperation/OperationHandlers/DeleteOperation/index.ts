import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity, Constructor } from "../../../../types"
import type { DeleteSQLBuilder } from "../../../../SQLBuilders"
import type { DeleteResult } from "./types"

export default class DeleteOperation<
    T extends Entity
> extends OperationHandler<T, DeleteSQLBuilder<T>, never> {
    public readonly fillMethod = 'One'

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Hooks.Delete
    public exec(): Promise<DeleteResult> {
        return this.execMappedQuery()
    }

    // Privates ---------------------------------------------------------------
    protected override async execMappedQuery(): Promise<DeleteResult> {
        const { affectedRows, serverStatus } = (
            await this.connection.query(this.sqlBuilder.SQL())
        ) as any

        return { affectedRows, serverStatus }
    }
}

export type {
    DeleteResult
}
