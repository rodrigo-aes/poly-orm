// Utils
import ProxyMerge from "../../../utils/ProxyMerge"

// Types
import type { Entity } from "../../../types"
import type Collection from "../Collection"
import type { PaginationInitMap, PaginationJSON } from "./types"

export default class Pagination<
    T extends Entity,
    D extends Collection<T> = Collection<T>
> {
    public page: number = 1
    public perPage: number = 26
    public total: number = 0
    public pages: number = 1
    public prevPage: number | null = null
    public nextPage: number | null = null

    /** @internal */
    public data: D

    /** @internal */
    constructor(initMap: PaginationInitMap, data: D) {
        Object.assign(this, initMap)

        this.pages = Math.ceil(this.total / this.perPage)
        this.prevPage = this.page > 1 ? this.page - 1 : null
        this.nextPage = this.page < this.pages ? this.page + 1 : null

        this.data = data

        return new ProxyMerge(this, this.data) as any
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of pagination and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON(): PaginationJSON<T> {
        const data = this.data.toJSON()

        return {
            page: this.page,
            perPage: this.perPage,
            total: this.total,
            pages: this.pages,
            prevPage: this.prevPage,
            nextPage: this.nextPage,
            ...Array.isArray(data) ? { data } : data
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Build a instance of pagination with data
     * @param initMap - Pagination properties
     * @param data - Entities data
     * @returns - A pagination instace with data
     */
    public static build<T extends Entity, D extends Collection<T>>(
        initMap: PaginationInitMap,
        data: D
    ): Pagination<T, D> & D {
        return new this(initMap, data) as Pagination<T, D> & D
    }
}

export {
    type PaginationInitMap
}