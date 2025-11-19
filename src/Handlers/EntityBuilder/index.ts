// Objects
import { BaseEntity, Collection } from "../../Entities"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types"
import type { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"
import type { CreationAttributesOptions } from "../../SQLBuilders"

export default class EntityBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public attibutes: CreationAttributesOptions<InstanceType<T>>,
        public primary?: any
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public build(): InstanceType<T> | Collection<InstanceType<T>> {
        return Array.isArray(this.attibutes)
            ? this.buildManyEntities()
            : this.buildEntity()
    }

    // Privates ---------------------------------------------------------------
    private buildEntity(
        attributes?: CreationAttributesOptions<InstanceType<T>>
    ): InstanceType<T> {
        const entity = (new this.target() as BaseEntity).fill(
            (attributes ?? this.attibutes) as any
        ) as InstanceType<T>

        if (this.primary) this.fillPrimaryKey(entity)

        return entity
    }

    // ------------------------------------------------------------------------

    private buildManyEntities(): Collection<InstanceType<T>> {
        return new Collection(
            ...(this.attibutes as CreationAttributesOptions<InstanceType<T>>[])
                .map(att => this.buildEntity(att))
        )
    }

    // ------------------------------------------------------------------------

    private fillPrimaryKey(
        entity: InstanceType<T>
    ): void {
        const metadata = this.metadata.columns.primary
        const primaryName = this.metadata.columns.primary.name as (
            keyof InstanceType<T>
        )
        const shouldFill = (
            metadata.dataType.type === 'bigint' &&
            metadata.autoIncrement &&
            !entity[primaryName]
        )

        if (shouldFill) (entity[primaryName] as number) = this.primary!
    }
}