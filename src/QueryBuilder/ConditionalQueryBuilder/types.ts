import type { BaseEntity } from "../../Entities"
import type AndQueryBuilder from "../AndQueryBuilder"

export type AndQueryFunction<T extends BaseEntity> = (
    (queryBuilder: AndQueryBuilder<T>) => void
)