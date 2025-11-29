import { MetadataHandler } from "../Metadata"

// Query Builders
import FindOneQueryBuilder from "./FindOneQueryBuilder"
import FindQueryBuilder from "./FindQueryBuilder"
import PaginateQueryBuilder from "./PaginateQueryBuilder"
import CountQueryBuilder from "./CountQueryBuilder"
import CountManyQueryBuilder from "./CountManyQueryBuilder"

// Types
import type { Entity, TargetMetadata, Constructor } from "../types"

export default class QueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<Constructor<T>>

    /** @internal */
    protected alias?: string

    constructor(
        public target: Constructor<T>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Instantiate and return a `FindOneQueryBuilder`
     * @param alias - Entity query alias
     * @returns {FindOneQueryBuilder<T>} - FindOneQueryBuilder
     */
    public findOne(alias?: string): FindOneQueryBuilder<T> {
        return new FindOneQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `FindQueryBuilder`
     * @param alias - Entity query alias
     * @returns {FindQueryBuilder<T>} - FindQueryBuilder
     */
    public find(alias?: string): FindQueryBuilder<T> {
        return new FindQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `PaginateQueryBuilder`
     * @param page - Current page
     * @param perPage - Results per page
     * @param alias - Entity query alias
     * @returns {PaginateQueryBuilder<T>} - PaginateQueryBuilder
     */
    public paginate(page: number = 1, perPage: number = 26, alias?: string): (
        PaginateQueryBuilder<T>
    ) {
        return new PaginateQueryBuilder(
            this.target,
            page,
            perPage,
            alias ?? this.alias
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `CountQueryBuilder`
     * @param alias - Entity query alias
     * @returns {CountQueryBuilder<T>} - CountQueryBuilder
     */
    public count(alias?: string): CountQueryBuilder<T> {
        return new CountQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `CountManyQueryBuilder`
     * @param alias - Entity query alias
     * @returns {CountManyQueryBuilder<T>} - CountManyQueryBuilder
     */
    public countMany(alias?: string): CountManyQueryBuilder<T> {
        return new CountManyQueryBuilder(this.target, alias ?? this.alias)
    }
}