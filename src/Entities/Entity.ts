import {
    MetadataHandler,
    TempMetadata,

    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType,
    type HookType
} from "../Metadata"

import {
    ColumnsSnapshots,
    Collection,

    type Pagination,
} from "./Components"

// Types
import type BasePolymorphicEntity from "./BasePolymorphicEntity"
import type BaseEntity from "./BaseEntity"
import type {
    FindOneResult,
    FindResult,
    MapOptions,
    CollectMapOptions,
    CountManyResult
} from "../Handlers"

import type {
    FindOneQueryOptions,
    FindQueryOptions,
    PaginationQueryOptions,
    CountQueryOption,
    CountQueryOptions,
    ConditionalQueryOptions,
    CreationAttributes
} from "../SQLBuilders"

import {
    HasOneHandler,
    HasManyHandler,
    BelongsToHandler,
    HasOneThroughHandler,
    HasManyThroughHandler,
    BelongsToThroughHandler,
    BelongsToManyHandler,
    PolymorphicHasOneHandler,
    PolymorphicHasManyHandler,
    PolymorphicBelongsToHandler,

    type HasOne,
    type HasMany,
    type BelongsTo,
    type HasOneThrough,
    type HasManyThrough,
    type BelongsToThrough,
    type BelongsToMany,
    type PolymorphicHasOne,
    type PolymorphicHasMany,
    type PolymorphicBelongsTo,
    type PolymorphicBelongsToRelated
} from "../Relations"

import type {
    Entity as EntityT,
    Target,
    StaticTarget,
    TargetMetadata,
    TargetRepository,
    TargetQueryBuilder,
    Constructor,

    EntityJSON,
    EntityObject,
    EntityProperties,
    EntityRelations,
    EntityRelationsKeys
} from "../types"

// Exceptions
import PolyORMException from "../Errors"

export default abstract class Entity {
    /** @internal */
    declare readonly __defaultCollection: Collection<EntityT>

    public static readonly INHERIT_HOOKS: boolean = true
    public static readonly INHERIT_ONLY_HOOKS?: HookType[]

    /** @internal */
    public static readonly __registered = new Set<string>()

    /** @internal */
    private __pk?: string

    /** @internal */
    private __wherePK?: ConditionalQueryOptions<EntityT>

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
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

    // ------------------------------------------------------------------------

    /** @internal */
    public get shouldUpdate(): boolean {
        return ColumnsSnapshots.shouldUpdate(this as any)
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get _pk(): string {
        return this.__pk ??= (this as any).getTrueMetadata().PK
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get _wherePK(): any {
        return this.__wherePK ??= {
            [this._pk]: this[this._pk as keyof this]
        } as any
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public getMetadata<T extends EntityT>(this: T): any {
        return this.getTrueMetadata().toJSON()
    }

    // ------------------------------------------------------------------------

    /**
     * Make a JSON object of entity properties and relations
     * @returns - Entity object without hidden properties and relations
     */
    public toJSON<T extends EntityT>(this: T): EntityJSON<T, T['hidden']> {
        return Object.fromEntries(this.entries(true)) as (
            EntityJSON<T, T['hidden']>
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Make a JSON object of entity properties and relations
     * @returns - Entity complete object properties and relations
     */
    public toObject<T extends EntityT>(this: T): EntityObject<T> {
        return Object.fromEntries(this.entries()) as EntityObject<T>
    }

    // ------------------------------------------------------------------------

    public columns<T extends EntityT>(this: T): EntityProperties<T> {
        return Object.fromEntries(this.colEntries()) as EntityProperties<T>
    }

    // ------------------------------------------------------------------------

    public relations<T extends EntityT>(this: T): EntityRelations<T> {
        return Object.fromEntries(this.relEntries()) as EntityRelations<T>
    }

    // ------------------------------------------------------------------------

    /**
     * Get entity properties and relations entries
     * @param {boolean} hide - Exclude hidden properties if `true`
     * @returns {[keyof T, any][]} - Entity entries tuple array
     */
    public entries<T extends EntityT>(this: T, hide: boolean = false): [
        keyof T, any
    ][] {
        return this
            .colEntries(hide)
            .concat(
                this.includedEntries(),
                this.relEntries(hide)
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entity properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill<T extends EntityT>(
        this: T,
        data: Partial<CreationAttributes<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public getTrueMetadata<T extends EntityT>(this: T): TargetMetadata<T> {
        return MetadataHandler.targetMetadata(this.constructor as (
            Constructor<T>
        ))
    }

    // Protecteds -------------------------------------------------------------
    protected hasOne<
        T extends EntityT,
        R extends EntityT = EntityT
    >(this: T, name: string, entity?: R): HasOne<R> {
        return HasOneHandler<R>(
            this.validRel(name, HasOneMetadata),
            this,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasMany<
        T extends EntityT,
        R extends EntityT = EntityT,
        C extends Collection<R> = Collection<R>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasMany<R, C> {
        return HasManyHandler<R, C>(
            this.validRel(name, HasManyMetadata),
            this,
            ...this.resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected belongsTo<
        T extends EntityT,
        R extends EntityT = EntityT
    >(
        this: T,
        name: string,
        entity?: R
    ): BelongsTo<R> {
        return BelongsToHandler<R>(
            this.validRel(name, BelongsToMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasOneThrough<T extends EntityT, R extends EntityT = EntityT>(
        this: T,
        name: string,
        entity?: R
    ): HasOneThrough<R> {
        return HasOneThroughHandler<R>(
            this.validRel(name, HasOneThroughMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasManyThrough<
        T extends EntityT,
        R extends EntityT = EntityT,
        C extends Collection<R> = Collection<R>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasManyThrough<R, C> {
        return HasManyThroughHandler<R, C>(
            this.validRel(name, HasManyThroughMetadata),
            this,
            ...this.resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToThrough<T extends EntityT, R extends EntityT = EntityT>(
        this: T,
        name: string,
        entity?: R
    ): BelongsToThrough<R> {
        return BelongsToThroughHandler<R>(
            this.validRel(name, BelongsToThroughMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToMany<
        T extends EntityT,
        R extends EntityT = EntityT,
        C extends Collection<R> = Collection<R>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): BelongsToMany<R, C> {
        return BelongsToManyHandler<R, C>(
            this.validRel(name, BelongsToManyMetadata),
            this,
            ...this.resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasOne<
        T extends EntityT,
        R extends EntityT = EntityT
    >(
        this: T,
        name: string,
        entity?: R
    ): PolymorphicHasOne<R> {
        return PolymorphicHasOneHandler<R>(
            this.validRel(name, PolymorphicHasOneMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasMany<
        T extends EntityT,
        R extends EntityT = EntityT,
        C extends Collection<R> = Collection<R>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): PolymorphicHasMany<R, C> {
        return PolymorphicHasManyHandler<R, C>(
            this.validRel(name, PolymorphicHasManyMetadata),
            this,
            ...this.resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends EntityT,
        R extends BasePolymorphicEntity<any> | BaseEntity[]
    >(
        this: T,
        name: string,
        polymorphicEntity?: PolymorphicBelongsToRelated<R>
    ): PolymorphicBelongsTo<R> {
        return PolymorphicBelongsToHandler<R>(
            this.validRel(name, PolymorphicBelongsToMetadata),
            this,
            undefined,
            polymorphicEntity
        )
    }

    // ------------------------------------------------------------------------
    /** @internal */
    private validRel<T extends EntityT, R extends RelationMetadataType>(
        this: T,
        name: string,
        shouldBe: Constructor<R>
    ): R {
        const meta = this.getTrueMetadata().relations.findOrThrow(name)
        return (
            meta instanceof shouldBe ? meta : PolyORMException.Metadata.throw(
                'INVALID_RELATION',
                meta.type,
                meta.name,
                shouldBe.name.replace('Metadata', '')
            )
        ) as R
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private resolveColl<T extends EntityT, C extends Collection<any>>(
        this: T,
        collection: C | Constructor<C>
    ): [Constructor<C>, C] {
        return collection instanceof Collection
            ? [collection.constructor as Constructor<C>, collection]
            : [collection, new collection]
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private colEntries<T extends EntityT>(
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
    private relEntries<T extends EntityT>(
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
    private includedEntries<T extends EntityT>(this: T): [
        keyof T, any
    ][] {
        return (this.include as (keyof T)[]).map(key =>
            [key, this.validInclude(this[key as keyof T])]
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private validInclude(prop: any): any {
        return ['symbol', 'function'].includes(typeof prop)
            ? PolyORMException.Metadata.throw(
                'INVALID_INCLUDED_VALUE',
                (prop as Symbol | Function).toString(),
                typeof prop,
                this.constructor.name
            )
            : prop
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public static getMetadata<T extends Target>(this: T) {
        return (this as any)
            .getTrueMetadata()
            .toJSON()
    }

    // ------------------------------------------------------------------------

    /**
     * Apply scope to entity
     * @param name - Scope name
     * @param args - Scope args
     * @returns - Scoped static entity
     */
    public static scope<T extends EntityT>(
        this: Constructor<T>,
        name: string,
        ...args: any[]
    ): StaticTarget<T> {
        const scoped = (this as StaticTarget<T>).reply()

        TempMetadata
            .reply(scoped, this)
            .setScope(
                scoped,
                (this as any)
                    .getTrueMetadata()
                    .scopes
                    ?.getOrThrow(name, ...args)
            )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Build a instance of entity with attributes data
     * @param attributes - Entity attributes
     * @returns - Entity instance
     */
    public static build<T extends EntityT>(
        this: Constructor<T>,
        attributes: CreationAttributes<T>
    ): T {
        const instance = new this().fill(attributes) as T
        instance.getTrueMetadata().computedProperties?.assign(instance)
        ColumnsSnapshots.set(instance, instance.columns())

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Search a entity register in database and return a instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public static findByPk<
        T extends EntityT,
        M extends MapOptions
    >(
        this: Constructor<T>,
        pk: any,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as any).getRepository().findByPk(pk, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
    *  Search the first register matched by options in database
    * @param options - Find one options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance or `null`
    */
    public static findOne<
        T extends EntityT,
        M extends MapOptions
    >(
        this: Constructor<T>,
        options?: FindOneQueryOptions<T>,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as any).getRepository().findOne(options as any, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
     *  Search all register matched by options in database
     * @param options - Find options
     * @param mapTo @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance collection
     */
    public static find<
        T extends EntityT,
        M extends CollectMapOptions<T> | undefined
    >(
        this: Constructor<T>,
        options?: FindQueryOptions<T>,
        mapTo?: M
    ): Promise<FindResult<T, M>> {
        return (this as any).getRepository().find(options, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public static paginate<T extends EntityT>(
        this: Constructor<T>,
        options: PaginationQueryOptions<T>
    ): Promise<Pagination<T, Collection<T>>> {
        return (this as any).getRepository().paginate(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public static count<T extends EntityT>(
        this: Constructor<T>,
        options: CountQueryOption<T>
    ): Promise<number> {
        return (this as any).getRepository().count(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public static countMany<
        T extends EntityT,
        O extends CountQueryOptions<T>
    >(
        this: Constructor<T>,
        options: O
    ): Promise<CountManyResult<T, O>> {
        return (this as any).getRepository().countMany(options)
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static getTrueMetadata<T extends EntityT>(
        this: Constructor<T>
    ): TargetMetadata<T> {
        return MetadataHandler.targetMetadata(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected static reply<T extends Constructor<EntityT>>(
        this: T
    ): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public static shouldRegisterMeta(...keys: string[]): boolean {
        const key = `${this.name}:${keys.join(':')}`
        return (!this.__registered.has(key) && !!this.__registered.add(key))
    }
}