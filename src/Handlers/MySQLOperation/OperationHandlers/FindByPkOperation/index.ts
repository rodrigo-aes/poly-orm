import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindByPkSQLBuilder } from "../../../../SQLBuilders"
import type { MapOptions } from "../types"
import type { FindOneResult } from "../FindOneOperation"

export default class FindByPkOperation<
    T extends Entity,
    M extends MapOptions
> extends OperationHandler<T, FindByPkSQLBuilder<T>, M> {
    public readonly fillMethod = 'One'

    @Hooks.Find
    public exec(): Promise<FindOneResult<T, M>> {
        return this.execMappedQuery()
    }
}