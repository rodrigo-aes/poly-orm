// SQL Builders
import { JoinSQLBuilder } from "../../SQLBuilders"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type {
    Entity,
    Constructor,
    TargetMetadata,
} from "../../types"

import type {
    ConditionalQueryOptions,
    AndQueryOptions
} from "../../SQLBuilders"

export default class ConditionalQueryJoinsHandler<T extends Entity> {
    protected metadata: TargetMetadata<T>
    private readonly handled = new Set<string>()

    constructor(
        public target: Constructor<T>,
        public conditional?: ConditionalQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    public joins(): JoinSQLBuilder<any>[] {
        return Object
            .entries(this.extractConditionalRelations())
            .flatMap(([key]) => this.handleJoins(key))
    }

    // ------------------------------------------------------------------------

    public joinsByKeys(keys: string[]): JoinSQLBuilder<any>[] {
        return keys.flatMap(key => this.handleJoins(key))
    }

    // ------------------------------------------------------------------------

    public joinByKey(key: string): JoinSQLBuilder<any>[] {
        return this.handleJoins(key)
    }

    // Privates ---------------------------------------------------------------
    private handleJoins(
        key: string,
        current: string = '',
        metadata: TargetMetadata<any> = this.metadata,
        alias: string = this.alias
    ): JoinSQLBuilder<any>[] {
        const [first, ...rest] = key.split('.')
        current += first

        const relation = metadata.relations.findOrThrow(first)
        const nextMeta = MetadataHandler.targetMetadata(relation.relatedTarget)
        const nextAlias = `${this.alias}_${relation.name}`
        const nextJoins = rest.length > 0
            ? this.handleJoins(rest.join('.'), current, nextMeta, nextAlias)
            : []

        return this.handled.has(current)
            ? nextJoins
            : this.handled.add(current) && [
                new JoinSQLBuilder(this.target, relation, undefined, alias),
                ...nextJoins
            ]
    }

    // ------------------------------------------------------------------------

    private extractConditionalRelations(): string[] {
        return Array.from(
            new Set(
                Array.isArray(this.conditional)
                    ? this.conditional.flatMap(
                        and => this.extractAndRelations(and)
                    )
                    : this.extractAndRelations(this.conditional as (
                        AndQueryOptions<T>
                    ))
            )
        )
    }

    // ------------------------------------------------------------------------

    private extractAndRelations(and: AndQueryOptions<T>): string[] {
        return Object
            .keys(and)
            .flatMap(key => key.includes('.')
                ? key.split('.').slice(0, -1).join('.')
                : this.metadata.relations.search(key)
                    ? key
                    : []
            )
    }
}