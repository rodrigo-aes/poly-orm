import Entity from "../Entity"

import {
    MetadataHandler,
    type PolymorphicEntityMetadata,

    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type EntityMetadata,
    type RelationMetadataType,
    type HookType
} from "../../Metadata"

// Childs
import { InternalPolymorphicEntities } from "./Components"
import type { Collection } from "../Components"

// Query Builder
import { PolymorphicEntityQueryBuilder } from "../../QueryBuilder"

// Relations
import {
    HasOne,
    HasMany,
    BelongsTo,
    HasOneThrough,
    HasManyThrough,
    BelongsToMany,
    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo
} from '../../Relations'

// Decorators
import {
    PolymorphicColumn,
    CommonRelation,
    PolymorphicRelation,
} from "../../Decorators"

// Handlers
import { PolymorphicEntityBuilder } from "../../Handlers"

// Types
import type BaseEntity from "../BaseEntity"
import type {
    PolymorphicEntityTarget,
    StaticPolymorphicEntityTarget,
    EntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor,
    StaticEntityTarget,
} from "../../types"

import type {
    Source,
    ResolveSource,
    SourceEntities,
    SourceEntity,
    EntityNames,
    EntitiesMap
} from "./types"
import type { ResultSetHeader } from "mysql2"
import type { DeleteResult } from "../../Handlers"
import type {
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttibutes,
    ConditionalQueryOptions,
} from "../../SQLBuilders"
import type { PolymorphicRepository } from "../../Repositories"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * All polymorphic entities needs to extends BaseEntity class
 * @example
* class Authenticable extends BasePolymorphicEntity<[User, Admin]> {}
*/

export default abstract class BasePolymorphicEntity<
    Targets extends BaseEntity[]
> extends Entity {
    /** @internal */
    public static readonly __ROLE: 'INTERNAL' | 'EXTERNAL' = 'EXTERNAL'

    public static readonly MERGE_POLYMORPHIC_RELATIONS: boolean = true
    public static readonly INHERIT_HOOKS: boolean = true
    public static readonly INHERIT_ONLY_HOOKS?: HookType[]

    /**
     * Entity primary key
     */
    public primaryKey!: string | number

    /**
     * Entity type
     */
    public entityType!: EntityNames<Targets>

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): EntitiesMap<Targets> {
        return (this.getTrueMetadata() as PolymorphicEntityMetadata)
            .entities as EntitiesMap<Targets>
    }

    // Protecteds -------------------------------------------------------------
    protected get _sourcePk(): string {
        return this.getTrueSourceMetadata().columns.primary.name
    }

    // ------------------------------------------------------------------------

    protected get _whereSourcePk(): ConditionalQueryOptions<
        SourceEntity<Targets>
    > {
        return { [this._sourcePk]: this[this._pk as keyof this] } as (
            ConditionalQueryOptions<SourceEntity<Targets>>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository<
        T extends PolymorphicRepository<this> = PolymorphicRepository<this>
    >(): T {
        return this.getTrueMetadata().getRepository()
    }

    // ------------------------------------------------------------------------

    public getQueryBuilder<T extends BasePolymorphicEntity<any>>(this: T): (
        PolymorphicEntityQueryBuilder<Constructor<T>>
    ) {
        return new PolymorphicEntityQueryBuilder(
            this.constructor as Constructor<T>
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Convert current polymorphic instance to source entity instance
     * @returns - A original entity instance
     */
    public toSourceEntity<T extends Source<this>>(): ResolveSource<this, T> {
        return PolymorphicEntityBuilder.instantiateSourceEntity(
            this.entities[this.entityType],
            this
        ) as ResolveSource<this, T>
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of the source entity in database and return
     * the current polymorphic instance
     * @returns - Same polymorhic instance
     */
    public async save<T extends BasePolymorphicEntity<any>>(this: T): (
        Promise<T>
    ) {
        return this.getRepository().updateOrCreate(
            this.entityType,
            this.toSourceEntity()
        ) as Promise<T>
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of the source entity in database and returns the
     * current polymorphic instance
     * @param attributes - Update attributes data
     * @returns - Same polymorphic instance
     */
    public async update<T extends BasePolymorphicEntity<any>>(
        this: T,
        attributes: UpdateAttributes<T>
    ): Promise<T> {
        await this.getRepository()
            .update(
                this.entities[this.entityType],
                this.fill(attributes).toSourceEntity(),
                this._whereSourcePk as any
            )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the source entity in database
     */
    public async delete<T extends BasePolymorphicEntity<any>>(this: T) {
        await this.getRepository().delete(
            this.entities[this.entityType],
            this._whereSourcePk as any
        )
    }

    // Protecteds -------------------------------------------------------------
    /**
     * Create a instance of HasOneHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasOne<T, Related>} - HasOneHandler instance
     */
    protected hasOne<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasOne<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, HasOneMetadata)

        return new HasOne(metadata as HasOneMetadata, this, related)
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasManyHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasMany<T, Related>} - HasManyHandler instance
     */
    protected hasMany<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, HasManyMetadata)

        return new HasMany(metadata as HasManyMetadata, this, related)
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of BelongsToHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {BelongsTo<T, Related>} - BelongsToHandler instance
     */
    protected belongsTo<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): BelongsTo<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, BelongsToMetadata)

        return new BelongsTo(metadata as BelongsToMetadata, this, related)
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasOneThroughHandler class for current instance and
     * related (Note: hasOneThrough method doesn't need through entity)
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasOneThrough<T, Related>} - HasOneThroughHandler instance
    */
    protected hasOneThrough<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasOneThrough<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, HasOneThroughMetadata)

        return new HasOneThrough(
            metadata as HasOneThroughMetadata, this, related
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasManyThroughHandler class for current instance
     * and related (Note: hasManyThrough method doesn't need through entity)
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasManyThrough<T, Related>} - HasManyThroughHandler instance
     */
    protected hasManyThrough<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasManyThrough<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, HasManyThroughMetadata)

        return new HasManyThrough(
            metadata as HasManyThroughMetadata, this, related
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of BelongsToManyHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {BelongsToMany<T, Related>} - BelongsToManyHandler instance
     */
    protected belongsToMany<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): BelongsToMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, BelongsToManyMetadata)

        return new BelongsToMany(
            metadata as BelongsToManyMetadata, this, related
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicHasOneHandler class for current instance
     * and related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {PolymporhicHasOne<T, Related>} - PolymporhicHasOneHandler
     * instance
     */
    protected polymorphicHasOne<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicHasOne<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, PolymorphicHasOneMetadata)

        return new PolymorphicHasOne(
            metadata as PolymorphicHasOneMetadata, this, related
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicManyOneHandler class for current
     * instance and related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {PolymporhicManyOne<T, Related>} - PolymporhicManyOneHandler
     * instance
     */
    protected polymorphicHasMany<
        T extends BasePolymorphicEntity<any>,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicHasMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, PolymorphicHasManyMetadata)

        return new PolymorphicHasMany(
            metadata as PolymorphicHasManyMetadata, this, related
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicBelongsToHandler class for current
     * instance and relateds
     * @param name - Relation name
     * @param related - Related entities or a PolymorphicEntity
     * @returns {PolymporhicBelongsTo<T, Related>} - 
     * PolymporhicBelongsToHandler instance
     */
    protected polymorphicBelongsTo<
        T extends BasePolymorphicEntity<any>,
        Related extends PolymorphicEntityTarget | EntityTarget[]
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicBelongsTo<
        T,
        LocalOrInternalPolymorphicEntityTarget<Related>
    > {
        const metadata = this.getRelationMetadata(name)
        this.verifyRelationMetadata(metadata, PolymorphicBelongsToMetadata)

        return new PolymorphicBelongsTo(
            metadata as PolymorphicBelongsToMetadata,
            this,
            (Array.isArray(related) ? metadata.relatedTarget : related) as (
                LocalOrInternalPolymorphicEntityTarget<Related>
            )
        )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private getTrueSourceMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(
            this.entities[this.entityType] as EntityTarget
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getRelationMetadata(name: string): RelationMetadataType {
        return this.getTrueMetadata().relations.search(name)
            ?? this.getTrueSourceMetadata().relations.findOrThrow(name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private verifyRelationMetadata(
        metadata: RelationMetadataType,
        shouldBe: Constructor<RelationMetadataType>
    ) {
        if (!(metadata instanceof shouldBe)) PolyORMException.Metadata.throw(
            'INVALID_RELATION',
            metadata.type,
            metadata.name,
            shouldBe.name.replace('Metadata', '')
        )
    }

    // Static Getters =========================================================
    // Decorators -------------------------------------------------------------
    /**
     * Define polymorphic column to include decorator
     */
    public static get Column() {
        return PolymorphicColumn
    }

    // ------------------------------------------------------------------------

    /**
     * Define common relation to include decorator
     */
    public static get Relation() {
        return CommonRelation
    }

    // ------------------------------------------------------------------------

    /**
     * Define polymorphic relation to include decorator
     */
    public static get PolymorphicRelation() {
        return PolymorphicRelation
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getRepository<
        T extends PolymorphicEntityTarget,
        R extends PolymorphicRepository<InstanceType<T>>
    >(this: T): R {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getTrueMetadata()
            .getRepository() as R
    }

    // ------------------------------------------------------------------------

    public static getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    /**
     * Create a source entity register in database and returns a polymorphic 
     * entity instance of created register
     * @param source - Source entity
     * @param attributes - Creation attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - Source or polymorphic entity instance
     */
    public static create<
        T extends PolymorphicEntityTarget,
        S extends Source<InstanceType<T>>
    >(
        this: T,
        source: S,
        attributes: CreationAttributes<ResolveSource<InstanceType<T>, S>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<InstanceType<T>> {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getRepository()
            .create(source, attributes as any, mapTo) as Promise<
                InstanceType<T>
            >
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a polymorphic or source 
     * entity instances collection for created resgiters
     * @param source - Source entity
     * @param attributes - An array list for each register source entity 
     * creation attributes
     * @param mapTo - Return options map to case `this` returns a collection
     * of polymorphic entities instances case `source` returns a 
     * collection of source entities instances 
     * @returns - A collection of source or polymorphic entities instances
     */
    public static createMany<
        T extends PolymorphicEntityTarget,
        S extends Source<InstanceType<T>>
    >(
        this: T,
        source: S,
        attributes: CreationAttributes<ResolveSource<InstanceType<T>, S>>[],
        mapTo: 'this' | 'source' = 'this'
    ): Promise<Collection<InstanceType<T>>> {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getRepository()
            .createMany(source, attributes as any, mapTo) as Promise<
                Collection<InstanceType<T>>
            >

    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where optionsof the source 
     * entity in database with the data attributes
     * @param source - Source entity
     * @param attributes - Update attributes data
     * @param where - Conditional where options
     * @returns - A result header of the affected registers
     */
    public static update<
        T extends PolymorphicEntityTarget,
        S extends Source<InstanceType<T>>
    >(
        this: T,
        source: S,
        attributes: UpdateAttributes<ResolveSource<InstanceType<T>, S>>,
        where: ConditionalQueryOptions<ResolveSource<InstanceType<T>, S>>
    ): Promise<ResultSetHeader> {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getRepository()
            .update(source, attributes, where) as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent source entity register matched by attributes data or 
     * create a new 
     * @param source - Source entity
     * @param attributes - Update or create attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - A polymorphic or source entity instance for updated or 
     * created register
     */
    public static updateOrCreate<
        T extends PolymorphicEntityTarget,
        S extends Source<InstanceType<T>>
    >(
        this: T,
        source: S,
        attributes: UpdateOrCreateAttibutes<ResolveSource<InstanceType<T>, S>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<Collection<InstanceType<T>>> {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getRepository()
            .updateOrCreate(source, attributes as any, mapTo) as Promise<
                Collection<InstanceType<T>>
            >
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all source entity registers matched by conditional where 
     * options in database
     * @param source  - Source entity
     * @param where - Conditional where options
     * @returns - A result header of the affected register in database
     */
    public static delete<
        T extends PolymorphicEntityTarget,
        S extends Source<InstanceType<T>>
    >(
        this: T,
        source: S,
        where: ConditionalQueryOptions<ResolveSource<InstanceType<T>, S>>
    ): Promise<DeleteResult> {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getRepository()
            .delete(source, where)
    }
}

export {
    InternalPolymorphicEntities,

    type Source,
    type ResolveSource,
    type SourceEntities,
    type SourceEntity,
    type EntitiesMap,
    type EntityNames
}