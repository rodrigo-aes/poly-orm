import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

import { BaseEntity } from "../../Entities"
import { BasePolymorphicEntity } from "../../Entities"

// SQL Builders
import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"
import { ConditionalQueryJoinsHandler } from "../../Handlers"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { Entity, Target, TargetMetadata } from "../../types"

export default class DeleteSQLBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>

    constructor(
        public target: T,
        public where: (
            ConditionalQueryOptions<InstanceType<T>> | Entity
        ),
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.applyWhereScope()

        if (this.where instanceof BasePolymorphicEntity) this.where = (
            this.where.toSourceEntity()
        )
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[(
                (this.where as BasePolymorphicEntity<any>).entityType
            )]
            : this.metadata
    }

    // ------------------------------------------------------------------------

    protected get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get primary(): keyof BasePolymorphicEntity<any> {
        return this.targetMetadata.columns.primary.name as (
            keyof BasePolymorphicEntity<any>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            DELETE ${this.alias} FROM ${this.tableName} ${this.alias}
            ${this.joinsSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return (!this.isEntity())
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.where as ConditionalQueryOptions<InstanceType<T>>,
                this.alias
            )
                .joins()
                .map(join => join.SQL())
                .join(', ')

            : ''
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return ConditionalSQLBuilder.where(
            this.target,
            this.whereOptions(),
            this.alias
        )
            .SQL()
    }

    // Privates ---------------------------------------------------------------
    private applyWhereScope(): void {
        if (!this.isEntity()) this.where = ScopeMetadataHandler.applyScope(
            this.target,
            'conditional',
            this.where as ConditionalQueryOptions<InstanceType<T>>
        )

    }

    // ------------------------------------------------------------------------

    private isEntity(): boolean {
        return (
            this.where instanceof BaseEntity ||
            this.where instanceof BasePolymorphicEntity
        )
    }

    // ------------------------------------------------------------------------

    private whereOptions(): ConditionalQueryOptions<InstanceType<T>> {
        return (
            this.isEntity()
                ? {
                    [this.primary]: (this.where as BasePolymorphicEntity<any>)[
                        this.primary
                    ]
                }
                : this.where
        ) as ConditionalQueryOptions<InstanceType<T>>
    }
}
