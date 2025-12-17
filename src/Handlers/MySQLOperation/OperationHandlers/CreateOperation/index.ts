import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { BaseEntity } from "../../../../Entities"
import type { CreateSQLBuilder } from "../../../../SQLBuilders"
import type { ExecOptions } from "../types"
import type { CreateResult, CreateCollectMapOptions } from "./types"

export default class CreateOperation extends OperationHandler {
    public static readonly fillMethod = 'One'

    @Hooks.Create
    public static exec<
        T extends BaseEntity,
        B extends CreateSQLBuilder<T>,
        M extends CreateCollectMapOptions<T> = never
    >(options: ExecOptions<T, B, M>): Promise<CreateResult<T, M>> {
        return this.execMappedQuery(options)
    }
}

export type {
    CreateResult,
    CreateCollectMapOptions
}
