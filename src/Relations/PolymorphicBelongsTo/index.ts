import OneRelation from "../OneRelation"

// SQL Builders
import { PolymorphicBelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { Entity, Constructor } from "../../types"
import type { BasePolymorphicEntity } from "../../Entities"
import type { PolymorphicBelongsToMetadata } from "../../Metadata"

export default class PolymorphicBelongsTo<
    T extends Entity,
    R extends BasePolymorphicEntity<any>
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicBelongsToMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): PolymorphicBelongsToHandlerSQLBuilder<T, R> {
        return new PolymorphicBelongsToHandlerSQLBuilder(
            this.metadata,
            this.target
        )
    }
}