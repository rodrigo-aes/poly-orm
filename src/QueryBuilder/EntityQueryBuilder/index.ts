import QueryBuilder from "../QueryBuilder"

// Query Builders
import {
    InsertQueryBuilder,
    BulkInsertQueryBuilder
} from "../CreateQueryBuilder"
import UpdateQueryBuilder from "../UpdateQueryBuilder"
import UpdateOrCreateQueryBuilder from "../UpdateOrCreateQueryBuilder"
import DeleteQueryBuilder from "../DeleteQueryBuilder"

// Types
import type { BaseEntity } from "../../Entities"
import type { Constructor } from "../../types"

/**
 * Entity query builder
 */
export default class EntityQueryBuilder<
    T extends BaseEntity
> extends QueryBuilder<T> {
    constructor(public target: Constructor<T>, alias?: string) {
        super(target, alias)
    }

    /**
     * Instantiate and return a `InsertQueryBuilder`
     * @param alias - Entity query alias
     * @returns {InsertQueryBuilder<T>} - InsertQueryBuilder
     */
    public insert(alias?: string): InsertQueryBuilder<T> {
        return new InsertQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `BulkInsertQueryBuilder`
     * @param alias - Entity query alias
     * @returns {BulkInsertQueryBuilder<T>} - BulkInsertQueryBuilder
     */
    public bulkInsert(alias?: string): BulkInsertQueryBuilder<T> {
        return new BulkInsertQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `UpdateQueryBuilder`
     * @param alias - Entity query alias
     * @returns {UpdateQueryBuilder<T>} - UpdateQueryBuilder
     */
    public update(alias?: string): UpdateQueryBuilder<T> {
        return new UpdateQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `UpdateOrCreateQueryBuilder`
     * @param alias - Entity query alias
     * @returns {UpdateOrCreateQueryBuilder<T>} - UpdateOrCreateQueryBuilder
     */
    public updateOrCreate(alias?: string): UpdateOrCreateQueryBuilder<T> {
        return new UpdateOrCreateQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate and return a `DeleteQueryBuilder`
     * @param alias - Entity query alias
     * @returns {DeleteQueryBuilder<T>} - DeleteQueryBuilder
     */
    public delete(alias?: string): DeleteQueryBuilder<T> {
        return new DeleteQueryBuilder(this.target, alias ?? this.alias)
    }
}