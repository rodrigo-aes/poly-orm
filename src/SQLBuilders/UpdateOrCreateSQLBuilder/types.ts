import type {
    Entity,
    OptionalNullable,
    EntityProperties
} from "../../types"

export type UpdateOrCreateAttibutes<T extends Entity> = (
    OptionalNullable<EntityProperties<T>>
)