import type { Entity } from "../../types"

import type { SelectPropertyKey } from "../../SQLBuilders"
import type CaseQueryBuilder from "../CaseQueryBuilder"
import type { CaseQueryHandler } from "../types"

export type SelectPropertyType<T extends Entity> = (
    SelectPropertyKey<T> |
    CaseQueryBuilder<T>
)

export type SelectPropertiesOptions<T extends Entity> = (
    SelectPropertyKey<T> |
    CaseQueryHandler<T>
)