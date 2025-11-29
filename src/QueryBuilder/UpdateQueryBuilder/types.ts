import type { BaseEntity } from "../../Entities"
import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

export type WhereQueryFunction<T extends BaseEntity> = (
    (queryBuilder: ConditionalQueryBuilder<T>) => void
)
