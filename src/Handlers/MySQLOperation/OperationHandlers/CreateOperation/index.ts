import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { BaseEntity } from "../../../../Entities"
import type { CreateSQLBuilder } from "../../../../SQLBuilders"
import type { CreateResult, CreateCollectMapOptions } from "./types"

export default class CreateOperation<
    T extends BaseEntity,
    M extends CreateCollectMapOptions<T> | never
> extends OperationHandler<T, CreateSQLBuilder<T>, M> {
    public readonly fillMethod = 'One'

    @Hooks.Create
    public exec(): Promise<CreateResult<T, M>> {
        return this.execMappedQuery()
    }
}

export type {
    CreateResult,
    CreateCollectMapOptions
}
