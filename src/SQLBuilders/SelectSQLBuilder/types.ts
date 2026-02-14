import type { Entity, EntityPropsKeys } from "../../types"
import type {
    Case,
    CaseQueryOptions
} from "../ConditionalSQLBuilder"
import type { CountQueryOptions } from "../CountSQLBuilder"

export type SelectColumnsOption<T extends Entity> = (
    '*' |
    EntityPropsKeys<T>
)

export type SelectCaseOption<T extends Entity> = {
    [Case]: CaseQueryOptions<T>,
    as: string
}

export type SelectPropertyOptions<T extends Entity> = (
    SelectColumnsOption<T> |
    SelectCaseOption<T>
)

export type SelectOptions<T extends Entity> = {
    properties?: SelectPropertyOptions<T>[],
    count?: CountQueryOptions<T>
}