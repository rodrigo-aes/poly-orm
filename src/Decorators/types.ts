import type { Entity, EntityTarget, PolymorphicEntityTarget, CollectionTarget, PaginationTarget } from "../types"
import type DecoratorMeta from "./DecoratorMetadata"

export type EntityDecoratorContext = (
    ClassDecoratorContext & {
        metadata?: {
            entity: DecoratorMeta
        }
    }
)

export type EntityFieldDecoratorContext<T extends Entity, V = any> = (
    ClassFieldDecoratorContext<T, V> & {
        metadata?: {
            entity: DecoratorMeta
        }
    }
)

export type DecoratorFn = (
    (target: any) => any
)