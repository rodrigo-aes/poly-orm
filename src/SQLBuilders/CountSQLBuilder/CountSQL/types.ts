import type { Entity } from "../../../types"
import type {
    ConditionalQueryOptions,
    Case,
    CaseQueryOptions
} from "../../ConditionalSQLBuilder"

export type CountCaseOptions<T extends Entity> = {
    [Case]: CaseQueryOptions<T>
}

export type CountQueryOption<T extends Entity> = (
    string |
    ConditionalQueryOptions<T> |
    CountCaseOptions<T>
)