import type { Entity } from "../../types"

import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

export type CaseQueryTuple<T extends Entity> = [
    ConditionalQueryBuilder<T>,
    any
]