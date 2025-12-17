import Entity from "../Entity"

import {
    MetadataHandler,

    type PolymorphicEntityMetadata,
    type EntityMetadata,
} from "../../Metadata"

// Childs
import { InternalPolymorphicEntities } from "./Components"
import type { Collection } from "../Components"

// Query Builder
import { PolymorphicEntityQueryBuilder } from "../../QueryBuilder"

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
    Constructor,
} from "../../types"

import type { ResultSetHeader } from "mysql2"
import type { DeleteResult } from "../../Handlers"

import type {
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttributes,
    ConditionalQueryOptions,
} from "../../SQLBuilders"

import type { PolymorphicRepository } from "../../Repositories"

import type {
    Source,
    ResolveSource,
    SourceEntities,
    SourceEntity,
    EntityNames,
    EntitiesMap
} from "./types"

/**
 * All polymorphic entities needs to extends BaseEntity class
 * @example
* class Authenticable extends BasePolymorphicEntity<[User, Admin]> {}
*/
export default abstract class BasePolymorphicEntity<
    S extends BaseEntity[]
> extends Entity {
    /** @internal */
    declare readonly __defaultCollection: Collection<any>

    /** @internal */
    public static readonly __ROLE: 'INTERNAL' | 'EXTERNAL' = 'EXTERNAL'

    /**
     * Entity primary key
     */
    public primaryKey!: string | number

    /**
     * Entity type
     */
    public entityType!: EntityNames<S>

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): EntitiesMap<S> {
        return (this.getTrueMetadata() as PolymorphicEntityMetadata)
            .entities as EntitiesMap<S>
    }

    // Protecteds -------------------------------------------------------------
    protected get _sourcePk(): string {
        return this.getTrueSourceMetadata().columns.primary.name
    }

    // ------------------------------------------------------------------------

    protected get _whereSourcePk(): ConditionalQueryOptions<
        SourceEntity<S>
    > {
        return { [this._sourcePk]: this[this._pk as keyof this] } as (
            ConditionalQueryOptions<SourceEntity<S>>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository<
        T extends PolymorphicRepository<this> = PolymorphicRepository<this>
    >(): T {
        return this.getTrueMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    public getQueryBuilder<T extends BasePolymorphicEntity<any>>(this: T): (
        PolymorphicEntityQueryBuilder<T>
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
    public toSourceEntity<T extends Source<S>>(): ResolveSource<
        S, T
    > {
        return PolymorphicEntityBuilder.instantiateSourceEntity(
            this.entities[this.entityType],
            this
        ) as ResolveSource<S, T>
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of the source entity in database and return
     * the current polymorphic instance
     * @returns - Same polymorhic instance
     */
    public async save<T extends BasePolymorphicEntity<any>>(this: T): Promise<
        T
    > {
        for (const { name } of this.getTrueMetadata().relations) if (
            (this[name as keyof T] as Entity | Collection<any>).shouldUpdate
        ) (
            await (this[name as keyof T] as any).save()
        )

        return this.getRepository().updateOrCreate(
            this.entityType,
            this.toSourceEntity(),
            'this'
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
    ): Promise<ResultSetHeader> {
        return this.getRepository().update(
            this.entities[this.entityType],
            (this.fill(attributes).toSourceEntity() as BaseEntity)
                .toObject(),
            this._whereSourcePk as any
        ) as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the source entity in database
     */
    public async delete<T extends BasePolymorphicEntity<any>>(this: T): (
        Promise<void>
    ) {
        await this.getRepository().delete(
            this.entities[this.entityType],
            this._whereSourcePk as any
        )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private getTrueSourceMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(
            this.entities[this.entityType] as EntityTarget
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
    ): PolymorphicEntityQueryBuilder<InstanceType<T>> {
        return new PolymorphicEntityQueryBuilder(this as any)
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
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: CreationAttributes<ResolveSource<T, S>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<T> {
        return (this as any).getRepository().create(source, attributes, mapTo)
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
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: CreationAttributes<ResolveSource<T, S>>[],
        returns: 'this' | 'source' = 'this'
    ): Promise<Collection<T>> {
        return (this as any).getRepository().createMany(
            source, attributes, undefined, returns
        )
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
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: UpdateAttributes<ResolveSource<T, S>>,
        where: ConditionalQueryOptions<ResolveSource<T, S>>
    ): Promise<ResultSetHeader> {
        return (this as any).getRepository().update(source, attributes, where)
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
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: UpdateOrCreateAttributes<ResolveSource<T, S>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<Collection<T>> {
        return (this as any).getRepository().updateOrCreate(
            source, attributes, mapTo
        )
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
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        where: ConditionalQueryOptions<ResolveSource<T, S>>
    ): Promise<DeleteResult> {
        return (this as any).getRepository().delete(source, where)
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