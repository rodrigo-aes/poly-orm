import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindOneSQLBuilder } from "../../../../SQLBuilders"
import type { MapOptions, ExecOptions } from "../types"
import type { FindOneResult } from "./types"

export default class FindOneOperation extends OperationHandler {
    public static readonly fillMethod = 'One'

    @Hooks.Find
    public static exec<
        T extends Entity,
        B extends FindOneSQLBuilder<T>,
        M extends MapOptions
    >(options: ExecOptions<T, B, M>): Promise<FindOneResult<T, M>> {
        return this.execAndMap(options)
    }
}

export type {
    FindOneResult
}