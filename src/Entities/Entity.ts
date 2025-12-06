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
    ResultMapOption
} from "../Handlers"

import type { CountManyQueryResult } from "../Repositories"

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
    type PolymorphicBelongsTo
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
    EntityProperties
} from "../types"

// Exceptions
import PolyORMException from "../Errors"


export default abstract class Entity {
    public static readonly INHERIT_HOOKS: boolean = true
    public static readonly INHERIT_ONLY_HOOKS?: HookType[]

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

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get _pk(): string {
        return (this as any).getTrueMetadata().columns.primary.name
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get _wherePK(): ConditionalQueryOptions<this> {
        const pk = this._pk
        return { [pk]: this[pk as keyof this] } as ConditionalQueryOptions<
            this
        >
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

    /**
     * Get entity properties and relations entries
     * @param {boolean} hide - Exclude hidden properties if `true`
     * @returns {[keyof T, any][]} - Entity entries tuple array
     */
    public entries<T extends EntityT>(this: T, hide: boolean = false): [
        keyof T, any
    ][] {
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
    public fill<T extends EntityT>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public getTrueMetadata<T extends EntityT>(this: T): TargetMetadata<
        Constructor<T>
    > {
        return MetadataHandler.targetMetadata(this.constructor as (
            Constructor<T>
        ))
    }

    // Protecteds -------------------------------------------------------------
    protected hasOne<T extends EntityT = EntityT>(name: string): HasOne<T> {
        return HasOneHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name), HasOneMetadata
            ),
            this as any
        )
    }

    // ------------------------------------------------------------------------

    protected hasMany<
        T extends EntityT = EntityT,
        C extends Collection<T> = Collection<T>
    >(
        name: string,
        collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasMany<T, C> {
        return HasManyHandler<T, C>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name), HasManyMetadata
            ),
            this as any,
            collection
        )
    }

    // ------------------------------------------------------------------------

    protected belongsTo<T extends EntityT = EntityT>(name: string): BelongsTo<
        T
    > {
        return BelongsToHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name), BelongsToMetadata
            ),
            this as any
        )
    }

    // ------------------------------------------------------------------------

    protected hasOneThrough<T extends EntityT = EntityT>(
        name: string
    ): HasOneThrough<T> {
        return HasOneThroughHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name), HasOneThroughMetadata
            ),
            this as any
        )
    }

    // ------------------------------------------------------------------------

    protected hasManyThrough<
        T extends EntityT = EntityT,
        C extends Collection<T> = Collection<T>
    >(
        name: string,
        collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): HasManyThrough<T, C> {
        return HasManyThroughHandler<T, C>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name), HasManyThroughMetadata
            ),
            this as any,
            collection
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToThrough<T extends EntityT = EntityT>(
        name: string
    ): BelongsToThrough<T> {
        return BelongsToThroughHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name),
                BelongsToThroughMetadata
            ),
            this as any
        )
    }

    // ------------------------------------------------------------------------

    protected belongsToMany<
        T extends EntityT = EntityT,
        C extends Collection<T> = Collection<T>
    >(
        name: string,
        collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): BelongsToMany<T, C> {
        return BelongsToManyHandler<T, C>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name),
                BelongsToManyMetadata
            ),
            this as any,
            collection
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasOne<T extends EntityT = EntityT>(
        name: string
    ): PolymorphicHasOne<T> {
        return PolymorphicHasOneHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name),
                PolymorphicHasOneMetadata
            ),
            this as any
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasMany<
        T extends EntityT = EntityT,
        C extends Collection<T> = Collection<T>
    >(
        name: string,
        collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        )
    ): PolymorphicHasMany<T, C> {
        return PolymorphicHasManyHandler<T, C>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name),
                PolymorphicHasManyMetadata
            ),
            this as any,
            collection
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends BasePolymorphicEntity<any> | BaseEntity[]
    >(name: string): PolymorphicBelongsTo<T> {
        return PolymorphicBelongsToHandler<T>(
            this.verifyRelationMetadata(
                (this as any).getRelationMetadata(name),
                PolymorphicBelongsToMetadata
            ),
            this as any
        )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private getRelationMetadata<T extends EntityT>(
        this: T,
        name: string
    ): RelationMetadataType {
        return this.getTrueMetadata().relations.findOrThrow(name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private verifyRelationMetadata<T extends RelationMetadataType>(
        metadata: RelationMetadataType,
        shouldBe: Constructor<T>
    ): T {
        if (!(metadata instanceof shouldBe)) PolyORMException.Metadata.throw(
            'INVALID_RELATION',
            metadata.type,
            metadata.name,
            shouldBe.name.replace('Metadata', '')
        )

        return metadata as T
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private columnsEntries<T extends EntityT>(
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
    private relationsEntries<T extends EntityT>(
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
    private includedPropsEntries<T extends EntityT>(this: T): [
        keyof T, any
    ][] {
        return (this.include as (keyof T)[]).map(key =>
            [key, this.verifyIncludedProp(this[key as keyof T])]
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

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public static getMetadata<T extends Target>(this: T) {
        return (this as T & typeof Entity)
            .getTrueMetadata()
            .toJSON()
    }

    // ------------------------------------------------------------------------

    /**
     * Get a instance of entity repository
     */
    public static getRepository(): TargetRepository {
        throw PolyORMException.Common.instantiate(
            'UNIMPLEMENTED_METHOD',
            'static',
            'getRepository',
            this.name
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Get a instance of query builder
     */
    public static getQueryBuilder(): TargetQueryBuilder {
        throw PolyORMException.Common.instantiate(
            'UNIMPLEMENTED_METHOD',
            'static',
            'getQueryBuilder',
            this.name
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Apply scope to entity
     * @param name - Scope name
     * @param args - Scope args
     * @returns - Scoped static entity
     */
    public static scope<T extends Target>(
        this: T,
        name: string,
        ...args: any[]
    ): T {
        const scoped: T = (this as T & typeof Entity).reply()

        TempMetadata
            .reply(scoped, this)
            .setScope(scoped, (this as T & typeof Entity)
                .getTrueMetadata()
                .scopes
                ?.getOrThrow(name, ...args)
            )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Scope entity collection 
     * @param collection - Collection name or constructor
     * @returns - Scoped static entity
     */
    public static collection<T extends Target>(
        this: T,
        collection: string | typeof Collection
    ): T {
        const scoped: T = (this as StaticTarget<T>).reply()

        TempMetadata.reply(scoped, this).setCollection(
            scoped,
            typeof collection === 'object'
                ? collection
                : (this as StaticTarget<T>)
                    .getTrueMetadata()
                    .collections
                    .findOrThrow(collection)
        )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Build a instance of entity with attributes data
     * @param attributes - Entity attributes
     * @returns - Entity instance
     */
    public static build<T extends Target>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        const instance = new this().fill(attributes) as InstanceType<T>

        (instance.getTrueMetadata() as TargetMetadata<T>)
            .computedProperties
            ?.assign(instance)

        ColumnsSnapshots.set(instance, instance.toObject())

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
        T extends Target,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        pk: any,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as StaticTarget<T>)
            .getRepository()
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
        T extends Target,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindOneQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as StaticTarget<T>)
            .getRepository()
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
        T extends Target,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindResult<T, M>> {
        return (this as StaticTarget<T>)
            .getRepository()
            .find(options as any, mapTo) as Promise<FindResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public static paginate<T extends Target>(
        this: T,
        options: PaginationQueryOptions<InstanceType<T>>
    ): Promise<Pagination<InstanceType<T>>> {
        return (this as StaticTarget<T>)
            .getRepository()
            .paginate(options as any) as Promise<Pagination<InstanceType<T>>>
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public static count<T extends Target>(
        this: T,
        options: CountQueryOption<InstanceType<T>>
    ): Promise<number> {
        return (this as StaticTarget<T>)
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
        T extends Target,
        Opts extends CountQueryOptions<InstanceType<T>>
    >(
        this: T,
        options: Opts
    ): Promise<CountManyQueryResult<InstanceType<T>, Opts>> {
        return (this as StaticTarget<any>)
            .getRepository()
            .countMany(options)
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static getTrueMetadata<T extends Target>(this: T): (
        TargetMetadata<T>
    ) {
        return MetadataHandler.targetMetadata(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected static reply<T extends Target>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}