import type {
    Entity,
    Target,
    EntityRelationsKeys,
    EntityRelations,
    Constructor
} from '../../types'

import type { ConditionalQueryHandler } from '../types'

export type EntityExistsQueryOptions<T extends Entity> = Partial<{
    [K in EntityRelationsKeys<T>]: (
        boolean |
        EntityExistsQueryOption<
            Extract<EntityRelations<T>[K], Entity>
        >
    )
}>

export type EntityExistsQueryOption<T extends Entity> = {
    relations?: EntityExistsQueryOptions<T>
    where?: ConditionalQueryHandler<T>
}

export type ExistsQueryOptions<T extends Entity> = (
    string | EntityExistsQueryOptions<T>
)