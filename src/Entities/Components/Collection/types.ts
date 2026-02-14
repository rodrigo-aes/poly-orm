import type { CollectionProps } from "../../../types"
import type Collection from "."
import type { EntityJSON } from "../../../types"

type EmptyKeys<T> = keyof T extends [never] ? true : false

export type CollectionJSON<T extends Collection> = (
    T extends Collection<infer E>
    ? EmptyKeys<CollectionProps<Extract<T, Collection>>> extends true
    ? EntityJSON<E>[]
    : CollectionProps<Extract<T, Collection>> & {
        data: EntityJSON<E>[]
    }
    : never
)