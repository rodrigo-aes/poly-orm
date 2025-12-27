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
    private _isEntity?: boolean

    constructor(
        public target: Constructor<T>,
        public where: ConditionalQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        if (!this.isEntity) this.where = ScopeMetadataHandler.applyScope(
            this.target, 'conditional', this.where
        )
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get isEntity(): boolean {
        return this._isEntity ??= this.where instanceof EntityBase
    }

    // ------------------------------------------------------------------------

    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[(this.where as any).entityType]
            : this.metadata
    }

    // ------------------------------------------------------------------------

    protected get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get primary(): keyof BasePolymorphicEntity<any> {
        return this.targetMetadata.PK as (
            keyof BasePolymorphicEntity<any>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLString.sanitize(`
            DELETE ${this.alias} FROM ${this.tableName} ${this.alias}
            ${this.joinsSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return !this.isEntity
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.where as ConditionalQueryOptions<T>,
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
        return this.isEntity
            ? {
                [this.primary]: (this.where as any)[this.primary]
            }
            : this.where
    }
}
