import { Exists, Cross } from './Symbol'
import type {
    Entity,
    EntityRelationsKeys,
    EntityRelations,
    Constructor
} from '../../../types'
import { ConditionalQueryOptions } from '../types'

export type EntityExistsQueryOptions<T extends Entity> = Partial<{
    [K in EntityRelationsKeys<T>]: boolean | EntityExistsQueryOption<
        Extract<EntityRelations<T>[K], Entity>
    >
}>

export type EntityExistsQueryOption<T extends Entity> = {
    relations?: EntityExistsQueryOptions<T>
    where?: ConditionalQueryOptions<T>
}

export type EntityCrossExistsOption<T extends Entity> = (
    { target: Constructor<T> } & EntityExistsQueryOption<T>
)

export type EntityCrossExistsOptions<Entities extends Entity[] = Entity[]> = {
    [K in keyof Entities]: EntityCrossExistsOption<Entities[K]>
}

export type ExistsQueryOptions<T extends Entity> = {
    [Exists]: string | (
        EntityExistsQueryOptions<T> &
        Partial<{ [Cross]: EntityCrossExistsOptions }>
    )
}