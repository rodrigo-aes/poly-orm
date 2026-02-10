// Utils
import ProxyMerge from "../../../utils/ProxyMerge"
import Collection from "../Collection"

// Types
import type { Entity } from "../../../types"
import type { PaginationInitMap, PaginationJSON } from "./types"

export default class Pagination<
    D extends Collection = Collection,
    A extends string = string
> {
    public static readonly alias: string = this.name

    /** @internal */
    declare readonly __$alias: A

    /** @internal */
    public static readonly __$registered = new Set<string>()

    public page: number = 1
    public perPage: number = 26
    public total: number = 0
    public pages: number = 1
    public prevPage: number | null = null
    public nextPage: number | null = null

    /** @internal */
    private constructor(
        initMap: PaginationInitMap,

        /** @internal */
        public data: D
    ) {
        Object.assign(this, initMap)

        this.pages = Math.ceil(this.total / this.perPage)
        this.prevPage = this.page > 1 ? this.page - 1 : null
        this.nextPage = this.page < this.pages ? this.page + 1 : null

        return new ProxyMerge(this, this.data) as any
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of pagination and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON(): PaginationJSON<D> {
        const data = this.data.toJSON()

        return {
            page: this.page,
            perPage: this.perPage,
            total: this.total,
            pages: this.pages,
            prevPage: this.prevPage,
            nextPage: this.nextPage,
            ...Array.isArray(data) ? { data } : data
        } as any
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
        data: D | T[] = new Collection<T>() as D
    ): Pagination<D> & D {
        return new this(
            initMap,
            data instanceof Collection
                ? data
                : new Collection(...data)
        ) as any
    }
}

export {
    type PaginationInitMap,
    type PaginationJSON
}