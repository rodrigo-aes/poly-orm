import OneRelation from "../OneRelation"

import { MySQLOperation } from "../../Handlers"

// SQL Builders
import { PolymorphicBelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type {
    BasePolymorphicEntity,
    BaseEntity,
    Source,
    ResolveSource
} from "../../Entities"
import type { PolymorphicBelongsToMetadata } from "../../Metadata"
import type { RelationUpdateAttributes } from "../../SQLBuilders"
import type { ResultSetHeader } from "mysql2"
import type { PolymorphicBelongsToRelated, PolymorphicBelongsTo } from "./types"

export class PolymorphicBelongsToHandler<
    T extends Entity,
    R extends BasePolymorphicEntity<any> | BaseEntity[]
> extends OneRelation<T, PolymorphicBelongsToRelated<R>> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicBelongsToMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<PolymorphicBelongsToRelated<R>> = (
            metadata.relatedTarget as Constructor<
                PolymorphicBelongsToRelated<R>
            >
        ),

        protected instance?: PolymorphicBelongsToRelated<R> | null
    ) {
        super(metadata, target, related, instance)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): PolymorphicBelongsToHandlerSQLBuilder<
        T, any
    > {
        return new PolymorphicBelongsToHandlerSQLBuilder(
            this.metadata,
            this.target
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async load<T extends Source<R> = Source<R>>(): Promise<
        ResolveSource<R, T> | null
    > {
        return this.instance = await MySQLOperation.Relation.findOne(
            this.related,
            this.sqlBuilder.loadSQL()
        ) as any
    }

    // ------------------------------------------------------------------------

    public update<T extends Source<R> = Source<R>>(
        attributes: RelationUpdateAttributes<Extract<
            ResolveSource<R, T>, PolymorphicBelongsToRelated<R>
        >>,
    ): Promise<ResultSetHeader> {
        return MySQLOperation.Relation.update(
            this.related,
            this.sqlBuilder.updateSQL(attributes as any)
        )
    }
}

// ----------------------------------------------------------------------------

export default function PolymorphicBelongsTo<
    T extends BasePolymorphicEntity<any> | BaseEntity[]
>(
    metadata: PolymorphicBelongsToMetadata,
    target: Entity,
    related: Constructor<PolymorphicBelongsToRelated<T>> = (
        metadata.relatedTarget as Constructor<
            PolymorphicBelongsToRelated<T>
        >
    ),
    instance?: PolymorphicBelongsToRelated<T> | null
): PolymorphicBelongsTo<T> {
    return new PolymorphicBelongsToHandler(
        metadata,
        target,
        related,
        instance as any
    ) as PolymorphicBelongsTo<T>
}

export type {
    PolymorphicBelongsTo
}