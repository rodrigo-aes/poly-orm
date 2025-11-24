import Collection from "../Collection"

// Types
import type Entity from '../../Entity'
import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"
import type { PaginationInitMap, PaginationJSON } from "./types"

export default class Pagination<T extends (
    BaseEntity |
    BasePolymorphicEntity<any>
)> extends Collection<T> {
    public page: number = 1
    public perPage: number = 26
    public total: number = 0
    public pages: number = 1
    public prevPage: number | null = null
    public nextPage: number | null = null

    constructor(...entities: T[]) {
        super(...entities)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of pagination and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public override toJSON(): PaginationJSON<T> {
        const json = super.toJSON()
        const isArray = Array.isArray(json)

        return this.hide({
            page: this.page,
            perPage: this.perPage,
            total: this.total,
            pages: this.pages,
            prevPage: this.prevPage,
            nextPage: this.nextPage,
            ...isArray ? undefined : json,
            data: isArray ? json : json.data
        }) as PaginationJSON<T>
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected assign(pagination: PaginationInitMap): this {
        Object.assign(this, pagination)

        this.pages = Math.ceil(this.total / this.perPage)
        this.prevPage = this.page > 1 ? this.page - 1 : null
        this.nextPage = this.page < this.pages ? this.page + 1 : null

        return this
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Build a instance of pagination with data
     * @param pagination - Pagination properties
     * @param data - Entities data
     * @returns - A pagination instace with data
     */
    public static build<T extends (
        BaseEntity |
        BasePolymorphicEntity<any>
    )>(
        pagination: PaginationInitMap,
        data: T[] = []
    ): Pagination<T> {
        return new this(...data).assign(pagination)
    }
}

export {
    type PaginationInitMap
}