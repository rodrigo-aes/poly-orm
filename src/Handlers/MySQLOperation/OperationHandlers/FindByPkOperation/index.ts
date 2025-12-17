import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindByPkSQLBuilder } from "../../../../SQLBuilders"
import type { MapOptions, ExecOptions } from "../types"
import type { FindOneResult } from "../FindOneOperation"

export default class FindByPkOperation extends OperationHandler {
    public static readonly fillMethod = 'One'

    @Hooks.Find
    public static exec<
        T extends Entity,
        B extends FindByPkSQLBuilder<T>,
        M extends MapOptions
    >(options: ExecOptions<T, B, M>): Promise<FindOneResult<T, M>> {
        return this.execMappedQuery(options)
    }
}