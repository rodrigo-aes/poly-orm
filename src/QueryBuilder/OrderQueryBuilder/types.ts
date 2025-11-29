import type { Entity, Constructor } from "../../types"
import type { OrderQueryOption } from "../../SQLBuilders"
import type { CaseQueryHandler } from "../types"


export type OrderQueryOptions<T extends Entity> = (
    OrderQueryOption<T> |
    CaseQueryHandler<T>
)[]