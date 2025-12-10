import type {
    Entity,
    OptionalNullable,
    EntityProperties
} from "../../types"

export type UpdateOrCreateAttributes<T extends Entity = Entity> = (
    OptionalNullable<EntityProperties<T>>
)