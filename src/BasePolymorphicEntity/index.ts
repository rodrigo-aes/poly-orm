import {
    MetadataHandler,
    TempMetadata,

    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicEntityMetadata,
    type EntityMetadata,
    type RelationMetadataType,
    type HookType
} from "../Metadata"

// Childs
import { InternalPolymorphicEntities } from "./Components"
import { ColumnsSnapshots, Collection, Pagination } from "../BaseEntity"

// Query Builder
import { PolymorphicEntityQueryBuilder } from "../QueryBuilder"

// Repository
import PolymorphicRepository, {
    type FindOneResult,
    type FindResult,
    type CountManyQueryResult
} from "../PolymorphicRepository"

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
} from '../Relations'

// Decorators
import {
    PolymorphicColumn,
    CommonRelation,
    PolymorphicRelation,
} from "../Decorators"

// Handlers
import { PolymorphicEntityBuilder } from "../Handlers"

// Types
import type {
    PolymorphicEntityTarget,
    EntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor,
    EntityProperties,
    EntityObject,
    EntityJSON,
    StaticPolymorphicEntityTarget,
} from "../types"

import type { SourceEntity } from "./types"
import type { UnionEntitiesMap } from "../Metadata"
import type { ResultSetHeader } from "mysql2"
import type { ResultMapOption, DeleteResult } from "../Handlers"
import type {
    FindQueryOptions,
    FindOneQueryOptions,
    PaginationQueryOptions,
    CountQueryOption,
    CountQueryOptions,
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttibutes,
    ConditionalQueryOptions,
} from "../SQLBuilders"

// Exceptions
import PolyORMException from "../Errors"

/**
 * All polymorphic entities needs to extends BaseEntity class
 * @example
* class Authenticable extends BasePolymorphicEntity<[User, Admin]> {}
*/

export default abstract class BasePolymorphicEntity<Targets extends object[]> {
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
    public entityType!: string

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): UnionEntitiesMap {
        return this.getTrueMetadata().entities
    }

    // ------------------------------------------------------------------------
    /**
     * An array of properties keys that must be hidden in JSON
     */
    public get hidden(): string[] {
        return []
    }

    // ------------------------------------------------------------------------

    /**
     * An array of properties keys that must be included in JSON
     */
    public get include(): string[] {
        return []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get polymorphic entity metadata
     */
    public getMetadata() {
        return this.getTrueMetadata().toJSON()
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity repository
     */
    public getRepository<
        T extends PolymorphicRepository<Constructor<this>> = (
            PolymorphicRepository<Constructor<this>>
        )
    >(): T {
        return this.getTrueMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity query builder
     */
    public getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    /**
     * Make a JSON object of entity properties and relations
     * @returns - Entity object without hidden properties and relations
     */
    public toJSON<T extends BasePolymorphicEntity<any>>(this: T): (
        EntityJSON<T, T['hidden']>
    ) {
        return Object.fromEntries(this.entries(true)) as (
            EntityJSON<T, T['hidden']>
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Make a JSON object of entity properties and relations
     * @returns - Entity complete object properties and relations
     */
    public toObject<T extends BasePolymorphicEntity<any>>(this: T): (
        EntityObject<T>
    ) {
        return Object.fromEntries(this.entries()) as EntityObject<T>
    }

    // ------------------------------------------------------------------------

    /**
     * Get entity properties and relations entries
     * @param {boolean} hide - Exclude hidden properties if `true`
     * @returns {[keyof T, any][]} - Entity entries tuple array
     */
    public entries<T extends BasePolymorphicEntity<any>>(
        this: T,
        hide: boolean = false): [keyof T, any][] {
        return this
            .columnsEntries(hide)
            .concat(
                this.includedPropsEntries(),
                this.relationsEntries(hide)
            )
    }

    // ------------------------------------------------------------------------
    /**
     * Fill entity properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill<T extends BasePolymorphicEntity<Targets>>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Convert current polymorphic instance to source entity instance
     * @returns - A original entity instance
     */
    public toSourceEntity<T extends object | undefined = undefined>() {
        return PolymorphicEntityBuilder.instantiateSourceEntity(
            this.entities[this.entityType],
            this
        ) as (
                T extends object
                ? T
                : T extends undefined
                ? SourceEntity<Targets>
                : never
            )
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
        return this.fill(await this.getRepository().updateOrCreate(
            this.entities[this.entityType] as EntityTarget,
            this,
        ))
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of the source entity in database and returns the
     * current polymorphic instance
     * @param attributes - Update attributes data
     * @returns - Same polymorphic instance
     */
    public async update(attributes: UpdateAttributes<this>): Promise<this> {
        const source = this.fill(attributes).toSourceEntity()
        const pk = this.getTrueSourceMetadata().columns.primary.name

        await this.getRepository().update(
            this.entities[this.entityType],
            source,
            { [pk]: source[pk as keyof typeof source] }
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the source entity in database
     */
    public async delete<T extends BasePolymorphicEntity<any>>(this: T) {
        await this.getRepository().delete(this.entities[this.entityType], this)
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
    private getTrueMetadata(): PolymorphicEntityMetadata {
        return MetadataHandler.targetMetadata(
            this.constructor as PolymorphicEntityTarget
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getTrueSourceMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(this.entities[this.entityType])
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getRelationMetadata(name: string): RelationMetadataType {
        return this.getTrueMetadata().relations.search(name)
            ?? this.getTrueSourceMetadata().relations.findOrThrow(name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private columnsEntries<T extends BasePolymorphicEntity<any>>(
        this: T,
        hide: boolean = false
    ): [keyof T, any][] {
        return hide
            ? this.getTrueMetadata().columns.flatMap(({ name }) =>
                this.hidden.includes(name)
                    ? []
                    : [[name as keyof T, this[name as keyof T]]]
            )

            : this.getTrueMetadata().columns.map(({ name }) =>
                [name as keyof T, this[name as keyof T]]
            )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private relationsEntries<T extends BasePolymorphicEntity<any>>(
        this: T,
        hide: boolean = false
    ): [keyof T, any][] {
        return hide
            ? this.getTrueMetadata().relations.flatMap(({ name }) =>
                this.hidden.includes(name)
                    ? []
                    : [[
                        name as keyof T,
                        (this[name as keyof T] as any)?.toJSON()
                    ]]
            )

            : this.getTrueMetadata().relations.map(({ name }) =>
                [name as keyof T, (this[name as keyof T] as any)?.toJSON()]
            )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private includedPropsEntries<T extends BasePolymorphicEntity<any>>(
        this: T
    ): [keyof T, any][] {
        return (this.include as (keyof T)[]).map(key =>
            [key, this.verifyIncludedProp(this[key as keyof T])]
        )
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

    // ------------------------------------------------------------------------

    private verifyIncludedProp(prop: any): any {
        return ['symbol', 'function'].includes(typeof prop)
            ? PolyORMException.Metadata.throw(
                'INVALID_INCLUDED_VALUE',
                (prop as Symbol | Function).toString(),
                typeof prop,
                this.constructor.name
            )
            : prop
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
    /**
     * Get polymorphic entity metadata
     */
    public static getMetadata<T extends PolymorphicEntityTarget>(this: T) {
        return (this as StaticPolymorphicEntityTarget<T>)
            .getTrueMetadata()
            .toJSON()
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity repository
     */
    public static getRepository<
        T extends PolymorphicRepository<Target> = PolymorphicRepository<
            typeof this
        >,
        Target extends PolymorphicEntityTarget = any
    >(this: Target): T {
        return (this as Target & typeof BasePolymorphicEntity)
            .getTrueMetadata()
            .getRepository() as T
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity query builder
     */
    public static getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    /**
     * Apply scope to polymorphic entity
     * @param name - Scope name
     * @param args - Scope args
     * @returns - Scoped static polymorphic entity
     */
    public static scope<T extends PolymorphicEntityTarget>(
        this: T,
        name: string,
        ...args: any[]
    ): T {
        const scoped: T = (this as StaticPolymorphicEntityTarget<T>).reply()
        TempMetadata
            .reply(scoped, this)
            .setScope(scoped, (this as StaticPolymorphicEntityTarget<T>)
                .getTrueMetadata()
                .scopes
                .getOrThrow(name, ...args)
            )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Scope polymorphic entity collection 
     * @param collection - Collection name or constructor
     * @returns - Scoped static polymorphic entity
     */
    public static collection<T extends PolymorphicEntityTarget>(
        this: T,
        collection: string | typeof Collection
    ): T {
        const scoped: T = (this as StaticPolymorphicEntityTarget<T>).reply()
        TempMetadata.reply(scoped, this).setCollection(
            scoped,
            typeof collection === 'object'
                ? collection
                : (this as StaticPolymorphicEntityTarget<T>)
                    .getTrueMetadata()
                    .collections
                    .findOrThrow(collection)
        )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Build a instance of polymorphic entity with attributes data
     * @param attributes - Entity attributes
     * @returns - Polymorphic entity instance
     */
    public static build<T extends PolymorphicEntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        const instance = new this().fill(attributes) as InstanceType<T>
        instance.getTrueMetadata().computedProperties?.assign(instance)
        ColumnsSnapshots.set(instance, instance.toObject())

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Search a register in database and return a polymorphic 
     * entity instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public static findByPk<
        T extends PolymorphicEntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        pk: any,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .findByPk(pk, mapTo) as Promise<FindOneResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance collection
    */
    public static find<
        T extends PolymorphicEntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindResult<T, M>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .find(options, mapTo) as Promise<FindResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search the first register matched by options in database
    * @param options - Find one options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance or `null`
    */
    public static findOne<
        T extends PolymorphicEntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindOneQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .findOne(options, mapTo) as Promise<FindOneResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance pagination collection
    */
    public static paginate<T extends PolymorphicEntityTarget>(
        this: T,
        options: PaginationQueryOptions<InstanceType<T>>
    ): Promise<Pagination<InstanceType<T>>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .paginate(options) as Promise<Pagination<InstanceType<T>>>
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public static count<T extends PolymorphicEntityTarget>(
        this: T,
        options: CountQueryOption<InstanceType<T>>
    ): Promise<number> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .count(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public static countMany<
        T extends PolymorphicEntityTarget,
        Opts extends CountQueryOptions<InstanceType<T>>
    >(
        this: T,
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .countMany(options)
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
        Source extends EntityTarget
    >(
        this: T,
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<InstanceType<T>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .create(source, attributes, mapTo) as Promise<InstanceType<T>>
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
        Source extends EntityTarget
    >(
        this: T,
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>[],
        mapTo: 'this' | 'source' = 'this'
    ): Promise<Collection<InstanceType<T>>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .createMany(source, attributes, mapTo) as (
                Promise<Collection<InstanceType<T>>>
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
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T,
        source: Source,
        attributes: UpdateAttributes<InstanceType<Source>>,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<ResultSetHeader> {
        return (this as T & typeof BasePolymorphicEntity)
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
        Source extends EntityTarget
    >(
        this: T,
        source: Source,
        attributes: UpdateOrCreateAttibutes<InstanceType<Source>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<Collection<InstanceType<T>>> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .updateOrCreate(source, attributes, mapTo) as (
                Promise<Collection<InstanceType<T>>>
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
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T,
        source: Source,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<DeleteResult> {
        return (this as T & typeof BasePolymorphicEntity)
            .getRepository()
            .delete(source, where)
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private static getTrueMetadata<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityMetadata {
        return MetadataHandler.targetMetadata(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private static reply<T extends PolymorphicEntityTarget>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}

export {
    InternalPolymorphicEntities
}