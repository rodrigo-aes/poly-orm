import type Collection from "../Collection"
import type { CollectionJSON } from "../Collection/types"
import type { EntityJSON } from "../../../types"

export type PaginationInitMap = {
    page: number,
    perPage: number,
    total: number
}

export type PaginationJSON<D extends Collection> = {
    page: number
    perPage: number
    total: number
    pages: number
    prevPage: number | null
    nextPage: number | null
} & CollectionJSON<D> extends EntityJSON<any>[]
    ? { data: CollectionJSON<D> }
    : CollectionJSON<D>