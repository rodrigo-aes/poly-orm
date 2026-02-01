import type { Entity, EntityTarget, PolymorphicEntityTarget, CollectionTarget, PaginationTarget } from "../types"
import type DecoratorMetadata from "./DecoratorMetadata"

export type EntityDecoratorContext = (
    ClassDecoratorContext & {
        metadata?: {
            entity: DecoratorMetadata
        }
    }
)

export type EntityFieldDecoratorContext<T extends Entity, V = any> = (
    ClassFieldDecoratorContext<T, V> & {
        metadata?: {
            entity: DecoratorMetadata
        }
    }
)

export type DecoratorFn = (
    (target: any) => any
)