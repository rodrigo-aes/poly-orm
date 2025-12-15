import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"
import { Entity as EntityClass } from "../../../../Entities"

// Types
import type { Entity } from "../../../../types"
import type {
    UpdateSQLBuilder,
    UpdateAttributes
} from "../../../../SQLBuilders"
import type { UpdateResult } from "./types"

export default class UpdateOperation<
    T extends Entity,
    S extends T | UpdateAttributes<T>
> extends OperationHandler<T, UpdateSQLBuilder<T>, never> {
    public readonly fillMethod = 'One'

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Hooks.Update
    public exec(): Promise<UpdateResult<T, S>> {
        return this.execMappedQuery()
    }

    // Privates ---------------------------------------------------------------
    protected override async execMappedQuery(): Promise<UpdateResult<T, S>> {
        return (
            this.sqlBuilder._attributes instanceof EntityClass
                ? (async () => {
                    await this.execQuery()
                    return this.sqlBuilder._attributes
                })()
                : this.execQuery()
        ) as Promise<UpdateResult<T, S>>
    }
}

export type {
    UpdateResult
}