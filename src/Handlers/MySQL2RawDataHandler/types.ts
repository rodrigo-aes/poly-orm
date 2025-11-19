import type {
    Target,
    EntityTarget,
    PolymorphicEntityTarget,
    EntityProperties,
    EntityRelations
} from "../../types"

export type MySQL2RawData = any
export type DataFillMethod = 'One' | 'Many' | 'Paginate'

export type RawData<T extends Target> = (
    EntityProperties<InstanceType<T>> &
    Partial<EntityRelations<InstanceType<T>>>
)

export type MappedDataType<
    T extends EntityTarget | PolymorphicEntityTarget,
    M extends 'json' | 'entity'
> = M extends 'json'
    ? RawData<T>
    : M extends 'entity'
    ? InstanceType<T>
    : never 