import { MetadataHandler, type RelationMetadata } from "../../Metadata"

// Query Handlers
import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Types
import type {
    Entity,
    Constructor,
    TargetMetadata,
} from "../../types"

import type {
    RelationOptions,
    RelationsOptions
} from "../../SQLBuilders"

import type {
    JoinQueryOptions,
    JoinQueryClause,
} from "./types"

import type {
    SelectQueryHandler,
    ConditionalQueryHandler,
    JoinQueryHandler
} from "../types"

/**
 * Build `JOIN` options
 */
export default class JoinQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private options: JoinQueryClause<T> = {
        relations: {}
    }

    /** @internal */
    constructor(
        /** @internal */
        public target: Constructor<T>,

        /** @internal */
        public alias?: string,

        required?: boolean
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.options.required = required
    }

    // Instace Methods ========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Add required to current entity `INNER JOIN` to query options
     * @param relation - Related entity target
     * @param handler - Join query handler
     * @returns {this} - `this`
     */
    public innerJoin<T extends Entity>(
        relation: Constructor<T> | string,
        handler?: JoinQueryHandler<T>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this.options.relations!,
            handler,
            this.alias
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add optional to current entity `LEFT JOIN` to query options
     * @param relation - Related entity target
     * @param handler - Join query handler
     * @returns {this} - `this`
     */
    public leftJoin<T extends Entity>(
        relation: Constructor<T> | string,
        handler?: JoinQueryHandler<T>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this.options.relations!,
            handler,
            this.alias,
            false
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Handle select options to related join entity
     * @param handler - Select query handler
     * @returns {this} - `this`
     */
    public select(handler: SelectQueryHandler<T>): this {
        handler(this.options.select ??= new SelectQueryBuilder(
            this.target, this.alias
        ))

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define conditional `ON` clause to options
     * @param handler - On query handler
     * @returns {this} - `this`
     */
    public on(handler: ConditionalQueryHandler<T>): this {
        handler(this.options.on ??= new ConditionalQueryBuilder(
            this.target, this.alias
        ))

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `RelationOptions` object
    * @returns - A object with relation options
    */
    public toQueryOptions(): RelationOptions<T> {
        return {
            required: this.options.required,
            select: this.options.select?.toQueryOptions(),
            on: this.options.on?.toQueryOptions(),
            relations: this.relationsToOptions()
        }
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private relationsToOptions(): RelationsOptions<T> | undefined {
        if (this.options.relations) return Object.fromEntries(
            Object.entries(this.options.relations).map(
                ([name, value]) => [
                    name,
                    typeof value === 'boolean'
                        ? value
                        : (value as JoinQueryBuilder<any>).toQueryOptions()
                ]
            )
        ) as RelationsOptions<T>
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<
        Parent extends Entity = Entity,
        Related extends Entity = Entity
    >(
        metadata: TargetMetadata<any>,
        relation: Constructor<Related> | string,
        options: JoinQueryOptions<Parent>,
        handler?: JoinQueryHandler<Related>,
        alias?: string,
        required: boolean = true
    ) {
        if (handler) handler(this.instantiate(
            metadata, relation, options, alias, required
        ))
        else options[(
            typeof relation === 'string'
                ? relation
                : this.findRelation(metadata, relation).name
        ) as keyof JoinQueryOptions<Parent>] = true

    }

    // Privates ---------------------------------------------------------------
    private static instantiate<
        Parent extends Entity = Entity,
        Related extends Entity = Entity
    >(
        metadata: TargetMetadata<any>,
        relation: Constructor<Related> | string,
        options: JoinQueryOptions<Parent>,
        alias?: string,
        required: boolean = true
    ): JoinQueryBuilder<Related> {
        const [key, join] = JoinQueryBuilder.addJoin<Parent, Related>(
            metadata, relation, alias, required
        )

        options[key] = join

        return join
    }

    // ------------------------------------------------------------------------

    private static addJoin<
        Parent extends Entity = Entity,
        Related extends Entity = Entity
    >(
        metadata: TargetMetadata<any>,
        relation: Constructor<Related> | string,
        alias?: string,
        required: boolean = true
    ): [keyof JoinQueryOptions<Parent>, JoinQueryBuilder<Related>] {
        const { name, relatedTarget } = this.findRelation(metadata, relation)

        return [
            name as keyof JoinQueryOptions<Parent>,
            new JoinQueryBuilder(
                relatedTarget as Constructor<Related>,
                alias,
                required
            )
        ]
    }

    // ------------------------------------------------------------------------

    private static findRelation<Related extends Entity>(
        metadata: TargetMetadata<any>,
        relation: Constructor<Related> | string
    ): RelationMetadata {
        switch (typeof relation) {
            case "string": return (
                metadata.relations.findOrThrow(relation as string)
            )

            // ----------------------------------------------------------------

            case "function": return (
                metadata.relations?.findOrThrow(relation)
            )

            // ----------------------------------------------------------------

            default: throw new Error('Unreacheable Exception')
        }
    }
}

export {
    type JoinQueryOptions
}