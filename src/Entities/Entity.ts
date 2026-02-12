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
    Pagination,
} from "./Components"

// Types
import type BasePolymorphicEntity from "./BasePolymorphicEntity"
import type BaseEntity from "./BaseEntity"
import type {
    MapOptions,
    CollectMapOptions,
    PaginateMapOptions,
    FindOneResult,
    FindResult,
    PaginateResult,
    CountManyResult
} from "../Handlers"

import type {
    FindOneQueryOptions,
    FindQueryOptions,
    PaginationQueryOptions,
    CountQueryOption,
    CountQueryOptions,
    ConditionalQueryOptions,
    UpdateAttributes,
    CreationAttributes,
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

    type RelationHandler,
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
    Constructor,

    EntityJSON,
    EntityObject,
    EntityProperties,
    EntityRelations,
} from "../types"

// Exceptions
import PolyORMException from "../Errors"

export default abstract class Entity {
    declare readonly __defaultCollection: Collection
    declare readonly __collections: Collection[]

    declare readonly __defaultPagination: Pagination<any>
    declare readonly __paginations: Pagination<any>[]

    public static readonly INHERIT_HOOKS: boolean = true
    public static readonly INHERIT_ONLY_HOOKS?: HookType[]

    /** @internal */
    public static readonly __$registered = new Set<string>()

    /** @internal */
    private __$PK?: string

    /** @internal */
    private __$WPK?: ConditionalQueryOptions<EntityT>

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
    public get __$shouldUpdate(): boolean {
        return ColumnsSnapshots.shouldUpdate(this as any)
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected __$trueMetadata: TargetMetadata<EntityT> = (
        (this.constructor as StaticTarget).__$trueMetadata
    )

    // ------------------------------------------------------------------------

    /** @internal */
    protected get __$pk(): keyof EntityT {
        return this.__$PK ??= this.__$trueMetadata.PK as any
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get __$wherePK(): any {
        return this.__$WPK ??= { [this.__$pk]: this[this.__$pk as keyof this] }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static get __$trueMetadata(): TargetMetadata<EntityT> {
        return MetadataHandler.targetMetadata(this as any)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get Repository(): Constructor<TargetRepository<EntityT>> {
        throw PolyORMException.Common.instantiate(
            'UNIMPLEMENTED_GET', 'Repository', this.name
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public getMetadata: () => any = (
        (this.constructor as StaticTarget).getMetadata
    )

    // ------------------------------------------------------------------------

    /**
     * Make a JSON object of entity properties and relations
     * @returns - Entity object without hidden properties and relations
     */
    public toJSON<T extends EntityT>(this: T): EntityJSON<T> {
        return Object.fromEntries(this.entries(true)) as EntityJSON<T>
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
        return Object.fromEntries(this.__$colEntries()) as EntityProperties<T>
    }

    // ------------------------------------------------------------------------

    public relations<T extends EntityT>(this: T): EntityRelations<T> {
        return Object.fromEntries(this.__$relEntries()) as EntityRelations<T>
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
            .__$colEntries(hide)
            .concat(
                this.__$includedEntries(),
                this.__$relEntries(hide)
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entity properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill<T extends EntityT>(
        this: T,
        data: UpdateAttributes<T>
    ): T {
        Object.assign(this, data)
        return this
    }

    // Protecteds -------------------------------------------------------------
    protected hasOne<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>
    >(this: T, name: string, entity?: R): HasOne<R> {
        return HasOneHandler<T, R>(
            this.__$validRel(name, HasOneMetadata),
            this,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasMany<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>,
        C extends Collection<any> = Collection<any>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasMany<R, C> {
        return HasManyHandler<T, R, C>(
            this.__$validRel(name, HasManyMetadata),
            this,
            ...this.__$resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected belongsTo<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>
    >(
        this: T,
        name: string,
        entity?: R
    ): BelongsTo<R> {
        return BelongsToHandler<T, R>(
            this.__$validRel(name, BelongsToMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasOneThrough<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>
    >(
        this: T,
        name: string,
        entity?: R
    ): HasOneThrough<R> {
        return HasOneThroughHandler<T, R>(
            this.__$validRel(name, HasOneThroughMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected hasManyThrough<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>,
        C extends Collection<any> = Collection<any>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasManyThrough<R, C> {
        return HasManyThroughHandler<T, R, C>(
            this.__$validRel(name, HasManyThroughMetadata),
            this,
            ...this.__$resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToThrough<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>
    >(
        this: T,
        name: string,
        entity?: R
    ): BelongsToThrough<R> {
        return BelongsToThroughHandler<T, R>(
            this.__$validRel(name, BelongsToThroughMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToMany<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>,
        C extends Collection<any> = Collection<any>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): BelongsToMany<R, C> {
        return BelongsToManyHandler<T, R, C>(
            this.__$validRel(name, BelongsToManyMetadata),
            this,
            ...this.__$resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasOne<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>
    >(
        this: T,
        name: string,
        entity?: R
    ): PolymorphicHasOne<R> {
        return PolymorphicHasOneHandler<T, R>(
            this.__$validRel(name, PolymorphicHasOneMetadata),
            this,
            undefined,
            entity
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasMany<
        T extends EntityT,
        R extends Partial<EntityT> = Partial<EntityT>,
        C extends Collection<any> = Collection<any>
    >(
        this: T,
        name: string,
        collection: C | Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): PolymorphicHasMany<R, C> {
        return PolymorphicHasManyHandler<T, R, C>(
            this.__$validRel(name, PolymorphicHasManyMetadata),
            this,
            ...this.__$resolveColl(collection)
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends EntityT,
        R extends Partial<BasePolymorphicEntity<any>> | Partial<BaseEntity>[]
    >(
        this: T,
        name: string,
        polymorphicEntity?: BasePolymorphicEntity<any>
    ): PolymorphicBelongsTo<R> {
        return PolymorphicBelongsToHandler<R>(
            this.__$validRel(name, PolymorphicBelongsToMetadata),
            this,
            undefined,
            polymorphicEntity
        )
    }

    // ------------------------------------------------------------------------
    /** @internal */
    protected async __$saveRelations<T extends EntityT>(this: T): Promise<T> {
        for (const { name } of (this as Entity).__$trueMetadata.relations) if (
            (this[name as keyof T] as any).__$shouldUpdate !== false
        ) (
            await (this[name as keyof T] as any).save()
        )

        return this
    }

    // ------------------------------------------------------------------------
    /** @internal */
    private __$validRel<T extends EntityT, R extends RelationMetadataType>(
        this: T,
        name: string,
        shouldBe: Constructor<R>
    ): R {
        const meta = (this as Entity).__$trueMetadata.relations.findOrThrow(
            name
        )
        return (
            meta instanceof shouldBe
                ? meta
                : PolyORMException.Metadata.throw(
                    'INVALID_RELATION',
                    meta.type,
                    meta.name,
                    shouldBe.name.replace('Metadata', '')
                )
        ) as R
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private __$resolveColl<T extends EntityT, C extends Collection<any>>(
        this: T,
        collection: C | Constructor<C>
    ): [Constructor<C>, C] {
        return collection instanceof Collection
            ? [collection.constructor as Constructor<C>, collection]
            : [collection, new collection]
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private __$colEntries<T extends EntityT>(
        this: T,
        hide: boolean = false
    ): [keyof T, any][] {
        return hide
            ? (this as Entity).__$trueMetadata.columns.flatMap(({ name }) =>
                this.hidden.includes(name as any)
                    ? []
                    : [[name as keyof T, this[name as keyof T]]]
            )

            : (this as Entity).__$trueMetadata.columns.map(({ name }) =>
                [name as keyof T, this[name as keyof T]]
            )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private __$relEntries<T extends EntityT>(
        this: T,
        hide: boolean = false
    ): [keyof T, any][] {
        return hide
            ? (this as Entity).__$trueMetadata.relations.flatMap(({ name }) =>
                this.hidden.includes(name as any)
                    ? []
                    : [[
                        name as keyof T,
                        (this[name as keyof T] as any)?.toJSON()
                    ]]
            )

            : (this as Entity).__$trueMetadata.relations.map(({ name }) =>
                [name as keyof T, (this[name as keyof T] as any)?.toJSON()]
            )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private __$includedEntries<T extends EntityT>(this: T): [
        keyof T, any
    ][] {
        return (this.include as (keyof T)[]).map(key =>
            [key, this.__$validInclude(this[key as keyof T])]
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private __$validInclude(prop: any): any {
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
        return (this as StaticTarget<T>).__$trueMetadata.toJSON()
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
        (instance as Entity).__$trueMetadata.computedProperties?.assign(
            instance
        )
        ColumnsSnapshots.set(instance, instance.columns())

        return instance
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
        const scoped = (this as StaticTarget<T>).__$replyConstructor()

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
        return new (this as StaticTarget<T>)
            .Repository(this)
            .findByPk(pk, mapTo) as Promise<FindOneResult<T, M>>
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
        return new (this as StaticTarget<T>)
            .Repository(this)
            .findOne(options as any, mapTo) as Promise<FindOneResult<T, M>>
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
        M extends CollectMapOptions<T>
    >(
        this: Constructor<T>,
        options?: FindQueryOptions<T>,
        mapTo?: M
    ): Promise<FindResult<T, M>> {
        return new (this as StaticTarget<T>)
            .Repository(this)
            .find(options as any, mapTo) as Promise<FindResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapOptions - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public static paginate<
        T extends EntityT,
        M extends PaginateMapOptions<T>
    >(
        this: Constructor<T>,
        options?: PaginationQueryOptions<T>,
        mapOptions?: M
    ): Promise<PaginateResult<T, M>> {
        return new (this as StaticTarget<T>)
            .Repository(this)
            .paginate(options as any, mapOptions) as Promise<
                PaginateResult<T, M>
            >
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
        return new (this as StaticTarget<T>)
            .Repository(this)
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
        T extends EntityT,
        O extends CountQueryOptions<T>
    >(
        this: Constructor<T>,
        options: O
    ): Promise<CountManyResult<T, O>> {
        return (new (this as StaticTarget<T>)
            .Repository(this) as any)
            .countMany(options) as Promise<CountManyResult<T, O>>
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private static __$replyConstructor<T extends Constructor<EntityT>>(
        this: T
    ): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}