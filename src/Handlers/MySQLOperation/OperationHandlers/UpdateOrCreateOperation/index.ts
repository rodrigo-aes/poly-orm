import OperationHandler from "../OperationHandler"

// Types
import type { BaseEntity } from "../../../../Entities"
import type { UpdateOrCreateSQLBuilder } from "../../../../SQLBuilders"
import type { ExecOptions } from "../types"

export default class UpdateOrCreateOperation extends OperationHandler {
    public readonly fillMethod = 'One'

    public static exec<
        T extends BaseEntity,
        B extends UpdateOrCreateSQLBuilder<T>,
        M extends never
    >(options: ExecOptions<T, B, M>): Promise<T> {
        return this.execAndMap(options)
    }
}