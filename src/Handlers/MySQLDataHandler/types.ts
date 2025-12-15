import type {
    Entity,
    Target,
    EntityProperties,
    EntityRelations
} from "../../types"
import type { Collection, Pagination } from "../../Entities"

export type FillMethod = 'One' | 'Many' | 'Paginate'

export type JSONData<T extends Entity> = (
    EntityProperties<T> &
    Partial<EntityRelations<T>>
)

export type EntityData<T extends Entity> = (
    (T | null) |
    Collection<T> |
    Pagination<T>
)