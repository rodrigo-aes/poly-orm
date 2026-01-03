import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

import { Entity as EntityBase, BasePolymorphicEntity } from "../../Entities"

// SQL Builders
import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"
import { SQLString, ConditionalQueryJoinsHandler } from "../../Handlers"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../types"

export default class DeleteSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>
    private _entity?: boolean

    constructor(
        public target: Constructor<T>,
        public conditional: Entity | ConditionalQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        if (!this.entity) this.conditional = ScopeMetadataHandler.applyScope(
            this.target,
            'conditional',
            this.conditional as ConditionalQueryOptions<T>
        )
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get entity(): boolean {
        return this._entity ??= this.conditional instanceof EntityBase
    }

    // ------------------------------------------------------------------------

    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[(this.conditional as any).entityType]
            : this.metadata
    }

    // ------------------------------------------------------------------------

    protected get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get primary(): keyof (
        BasePolymorphicEntity<any> |
        ConditionalQueryOptions<T>
    ) {
        return this.targetMetadata.PK as any
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `DELETE ${this.alias} FROM ${this.tableName} ${this.alias} ${(
            this.joinsSQL()
        )} ${this.whereSQL()}`
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return !this.entity
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.conditional as ConditionalQueryOptions<T>,
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
    private whereOptions(): ConditionalQueryOptions<any> {
        return this.entity
            ? { [this.primary]: this.conditional[this.primary] }
            : this.conditional
    }
}
