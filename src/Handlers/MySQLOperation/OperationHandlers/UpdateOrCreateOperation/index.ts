import OperationHandler from "../OperationHandler"

// Types
import type { BaseEntity } from "../../../../Entities"
import type { UpdateOrCreateSQLBuilder } from "../../../../SQLBuilders"

export default class UpdateOrCreateOperation<
    T extends BaseEntity
> extends OperationHandler<
    T,
    UpdateOrCreateSQLBuilder<T>,
    never
> {
    public readonly fillMethod = 'One'

    public exec(): Promise<T> {
        return this.execMappedQuery()
    }
}