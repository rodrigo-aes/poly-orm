import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"
import { Entity as EntityClass } from "../../../../Entities"

// Types
import type { Entity } from "../../../../types"
import type {
    UpdateSQLBuilder,
    UpdateAttributes
} from "../../../../SQLBuilders"
import { ExecOptions } from "../types"

import type { UpdateResult } from "./types"

export default class UpdateOperation extends OperationHandler {
    public readonly fillMethod = 'One'

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Hooks.Update
    public static async exec<
        T extends Entity,
        S extends T | UpdateAttributes<T>
    >(
        { target, sqlBuilder }: ExecOptions<T, UpdateSQLBuilder<T>, never>
    ): Promise<UpdateResult<T, S>> {
        return (
            sqlBuilder.attributes instanceof EntityClass
                ? (async () => {
                    await this.execQuery(target, sqlBuilder)
                    return sqlBuilder.attributes
                })()
                : this.execQuery(target, sqlBuilder)
        ) as Promise<UpdateResult<T, S>>
    }
}

export type {
    UpdateResult
}