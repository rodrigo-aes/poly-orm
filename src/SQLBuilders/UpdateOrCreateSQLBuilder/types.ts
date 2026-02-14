import type { Entity, RequiredProps } from "../../types"

export type UpdateOrCreateAttributes<T extends Entity = Entity> = (
    RequiredProps<T>
)