import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindOneSQLBuilder } from "../../../../SQLBuilders"
import type { MapOptions } from "../types"
import type { FindOneResult } from "./types"

export default class FindOneOperation<
    T extends Entity,
    M extends MapOptions
> extends OperationHandler<T, FindOneSQLBuilder<T>, M> {
    public readonly fillMethod = 'One'

    @Hooks.Find
    public exec(): Promise<FindOneResult<T, M>> {
        return this.execMappedQuery()
    }
}

export type {
    FindOneResult
}