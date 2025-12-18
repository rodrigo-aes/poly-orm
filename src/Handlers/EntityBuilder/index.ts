// Objects
import {
    BaseEntity,
    BasePolymorphicEntity,
    Collection,
    InternalPolymorphicEntities
} from "../../Entities"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type {
    Entity,
    Constructor,
    Target,
    EntityTarget,
    PolymorphicEntityTarget,
    StaticTarget,
    StaticEntityTarget
} from "../../types"

import type { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"
import type {
    CreationAttributes,
    CreationAttributesOptions
} from "../../SQLBuilders"

export default class EntityBuilder<T extends EntityTarget> {
    public static readonly entityNamePattern = /^[A-Z][A-Za-z0-9]*$/

    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public attibutes: CreationAttributesOptions<InstanceType<T>>,
        public primary?: any
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<T extends Entity>(
        target: Target<T>,
        attributes: CreationAttributesOptions<T>
    ): T | Collection<T> {
        return Array.isArray(attributes)
            ? this.buildManyEntities(target, attributes)
            : this.buildEntity(target, attributes)
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicSource<
        S extends BaseEntity,
        T extends BasePolymorphicEntity<any>
    >(
        source: Constructor<S>,
        target: T
    ): S {
        return (source as StaticEntityTarget<S>).build({
            [MetadataHandler.targetMetadata(source).PK]: target.primaryKey,

            ...Object.fromEntries(
                MetadataHandler.targetMetadata(target.constructor as (
                    PolymorphicEntityTarget
                ))
                    .columns
                    .sourceColumns(source)
                    .map(([sourceCol, targetCol]) => [
                        sourceCol,
                        target[targetCol as (keyof T)]
                    ])
            )
        }) as S
    }

    // ------------------------------------------------------------------------

    public static makeInternalPolymorphic(
        metadata: PolymorphicEntityMetadata
    ): PolymorphicEntityTarget {
        const target = new Function(
            'BasePolymorphicEntity',
            `return class ${(
                this.validName(metadata.name)
            )} extends BasePolymorphicEntity {
                static __ROLE = 'INTERNAL'
                constructor () { super() }
            }`
        )(BasePolymorphicEntity)
        InternalPolymorphicEntities.set(target.name, target)

        return target
    }

    // Privates ---------------------------------------------------------------
    private static buildEntity<T extends Entity>(
        target: Target<T>,
        attributes: CreationAttributes<T>
    ): T {
        return (target as StaticTarget<T>).build<Entity>(attributes) as T
    }

    // ------------------------------------------------------------------------

    private static buildManyEntities<T extends Entity>(
        target: Target<T>,
        attributes: CreationAttributes<T>[]
    ): Collection<T> {
        return new Collection(...attributes.map(
            att => this.buildEntity(target, att)
        ))
    }

    // ------------------------------------------------------------------------

    private static validName(name: string): string {
        if (!this.entityNamePattern.test(name)) throw new Error(
            `Invalid entity name: ${name}`
        )

        return name
    }
}