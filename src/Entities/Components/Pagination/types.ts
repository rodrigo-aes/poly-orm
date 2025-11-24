import type Entity from "../../Entity"

export type PaginationInitMap = {
    page: number,
    perPage: number,
    total: number
}

export type PaginationJSON<T extends Entity> = {
    page: number
    perPage: number
    total: number
    pages: number
    prevPage: number | null
    nextPage: number | null
    data: T[],
    [K: string]: any
}