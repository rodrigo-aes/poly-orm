import {
    EntityMetadata,
    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType,
    type HookType
} from "../Metadata"

// Handlers
import { MetadataHandler, TempMetadata } from "../Metadata"

// Query Builder
import {
    EntityQueryBuilder,
} from "../QueryBuilder"

// Components
import {
    Collection,
    Pagination,
    ColumnsSnapshots,

    type PaginationInitMap
} from "./Components"

// Repository
import Repository, {
    type FindOneResult,
    type FindResult,
    type CountManyQueryResult,
    type ResultMapOption,
    type DeleteResult
} from "../Repository"

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

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor,
    EntityProperties
} from "../types"

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
 * All entities needs to extends BaseEntity class
 * @example
 * class User extends BaseEntity {}
 */
export default abstract class BaseEntity {
    public static readonly INHERIT_POLYMORPHIC_RELATIONS: boolean = true
    public static readonly INHERIT_HOOKS: boolean = true
    public static readonly INHERIT_ONLY_HOOKS?: HookType[]

    constructor(properties?: any) {
        if (properties) Object.assign(this, properties)
        this.getTrueMetadata().computedProperties?.assign(this)

        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /**
     * An array of properties keys that must be hidden in JSON
     */
    protected get hidden(): string[] {
        return []
    }

    // ------------------------------------------------------------------------

    /**
     * An array of properties keys that must be included in JSON
     */
    protected get include(): string[] {
        return []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public getMetadata<T extends BaseEntity>(this: T) {
        return this.getTrueMetadata().toJSON<Constructor<T>>()!
    }

    // ------------------------------------------------------------------------

    /**
     * Get a instance of entity repository
     */
    public getRepository<
        T extends Repository<Constructor<this>> = Repository<Constructor<this>>
    >(): T {
        return this.getTrueMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    /**
     * Get a instance of query builder
     */
    public getQueryBuilder<T extends BaseEntity>(this: T): (
        EntityQueryBuilder<Constructor<T>>
    ) {
        return new EntityQueryBuilder(this.constructor as Constructor<T>)
    }

    // ------------------------------------------------------------------------

    /**
     * Make as JSON object of entity properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON<T extends BaseEntity>(this: T): EntityProperties<T> {
        return this.hide(Object.fromEntries([
            ...this.getTrueMetadata().columns.map(({ name }) => [
                name,
                this[name as keyof T]
            ]),
            ...this.getIncludedProperties()
        ]))
    }

    // ------------------------------------------------------------------------

    /**
     * Hidde entity hidden properties
     * @param json - Optional data to make hidden
     * @returns A object without hidden properties
     */
    public hide<T extends BaseEntity>(this: T, json?: EntityProperties<T>): (
        EntityProperties<T>
    ) {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entity properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill<T extends BaseEntity>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of the current instance in database
     * @returns {this} - Same entity instance
     */
    public async save(): Promise<this> {
        this.fill(await this.getRepository().updateOrCreate(this, 'json'))
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of the current instance in database
     * @param {UpdateAttributes<this>} attributes -  Attributes data to update
     * @returns {this} - Same entity instance
     */
    public async update(attributes: UpdateAttributes<this>): Promise<this> {
        this.fill(attributes)
        await this.getRepository().update(this, this)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the current instance in database
     */
    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        await this.getRepository().delete(this)
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
        T extends BaseEntity,
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
            (
                Array.isArray(related)
                    ? metadata.relatedTarget
                    : related
            ) as LocalOrInternalPolymorphicEntityTarget<Related>
        )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private getTrueMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(
            this.constructor as EntityTarget
        ) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getRelationMetadata(name: string): (
        RelationMetadataType
    ) {
        const meta = this.getTrueMetadata().relations?.find(
            rel => rel.name === name
        )

        if (meta) return meta

        throw PolyORMException.Metadata.instantiate(
            'UNKNOWN_RELATION', name, this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getIncludedProperties<T extends BaseEntity>(this: T): (
        [keyof T, any][]
    ) {
        return (this.include as (keyof T)[]).map(key => {
            if (['symbol', 'function'].includes(typeof this[key])) (
                PolyORMException.Metadata.throw(
                    'INVALID_INCLUDED_VALUE',
                    (this[key] as Symbol | Function).toString(),
                    typeof this[key],
                    this.constructor.name
                )
            )

            return [key, this[key as keyof T]]
        })
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private verifyRelationMetadata(
        metadata: RelationMetadataType,
        shouldBe: Constructor<RelationMetadataType>
    ): void {
        if (!(metadata instanceof shouldBe)) PolyORMException.Metadata.throw(
            'INVALID_RELATION',
            metadata.type,
            metadata.name,
            shouldBe.name.replace('Metadata', '')
        )

    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get entity metadata
     */
    public static getMetadata<T extends EntityTarget>(this: T) {
        return (this as T & typeof BaseEntity).getMetadataInstance().toJSON<T>()
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of entity repository
     */
    public static getRepository<
        T extends Repository<Target> = Repository<typeof this>,
        Target extends EntityTarget = any
    >(this: Target): T {
        return (this as Target & typeof BaseEntity)
            .getMetadataInstance()
            .getRepository() as T
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of entity query builder
     */
    public static getQueryBuilder<T extends EntityTarget>(this: T): (
        EntityQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    /**
     * Apply scope to entity
     * @param name - Scope name
     * @param args - Scope args
     * @returns - Scoped static entity
     */
    public static scope<T extends EntityTarget>(
        this: T,
        name: string,
        ...args: any[]
    ): T {
        const scoped: T = (this as T & typeof BaseEntity).reply()

        TempMetadata.reply(scoped, this).setScope(
            scoped,
            (this as T & typeof BaseEntity).getMetadataInstance().scopes
                ?.getScope(name, ...args)! ?? PolyORMException.Metadata.throw(
                    "UNKNOWN_SCOPE", name, this.name
                )
        )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Scope entity collection 
     * @param collection - Collection name or constructor
     * @returns - Scoped static entity
     */
    public static collection<T extends EntityTarget>(
        this: T,
        collection: string | typeof Collection
    ): T {
        const scoped: T = (this as T & typeof BaseEntity).reply()

        TempMetadata.reply(scoped, this).setCollection(
            scoped,
            typeof collection === 'object'
                ? collection
                : (this as T & typeof BaseEntity).getMetadataInstance()
                    .collections?.findOrThrow(collection) ?? (
                    PolyORMException.Metadata.throw(
                        'UNKNOWN_COLLECTION', collection, this.name
                    )
                )
        )

        return scoped
    }

    // ------------------------------------------------------------------------

    /**
     * Build a instance of entity with attributes data
     * @param attributes - Entity attributes
     * @returns - Entity instance
     */
    public static build<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        return new this(attributes) as InstanceType<T>
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
        T extends EntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        pk: any,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as T & typeof BaseEntity)
            .getRepository()
            .findByPk(pk, mapTo) as Promise<FindOneResult<T, M>>
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
        T extends EntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindResult<T, M>> {
        return (this as T & typeof BaseEntity)
            .getRepository()
            .find(options, mapTo) as Promise<FindResult<T, M>>
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
        T extends EntityTarget,
        M extends ResultMapOption = 'entity'
    >(
        this: T,
        options?: FindOneQueryOptions<InstanceType<T>>,
        mapTo?: M
    ): Promise<FindOneResult<T, M>> {
        return (this as T & typeof BaseEntity)
            .getRepository()
            .findOne(options, mapTo) as Promise<FindOneResult<T, M>>
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public static paginate<T extends EntityTarget>(
        this: T,
        options: PaginationQueryOptions<InstanceType<T>>
    ): Promise<Pagination<InstanceType<T>>> {
        return (this as T & typeof BaseEntity).getRepository().paginate(
            options
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public static count<T extends EntityTarget>(
        this: T,
        options: CountQueryOption<InstanceType<T>>
    ): Promise<number> {
        return (this as T & typeof BaseEntity).getRepository().count(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public static countMany<
        T extends EntityTarget,
        Opts extends CountQueryOptions<InstanceType<T>>
    >(
        this: T,
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return (this as T & typeof BaseEntity).getRepository().countMany(
            options
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Create a register in database and returns a entity instance by created
     * register
     * @param attributes - Entity creation attributes
     * @returns - A entity instance for created register
     */
    public static create<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return (this as T & typeof BaseEntity)
            .getRepository<Repository<T>>()
            .create(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a entity instance 
     * collection by created resgiters
     * @param attributes - An array list for each register entity creation
     * attributes
     * @returns - A entity instance collection for created registers
     */
    public static createMany<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>[]
    ): Promise<InstanceType<T>[]> {
        return (this as T & typeof BaseEntity)
            .getRepository<Repository<T>>()
            .createMany(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public static update<T extends EntityTarget>(
        this: T,
        attributes: UpdateAttributes<InstanceType<T>>,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<ResultSetHeader> {
        return (this as T & typeof BaseEntity)
            .getRepository()
            .update(attributes, where) as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent register matched by attributes data or create a new
     * @param attributes - Update or create attributes data 
     * @returns - A entity instance for updated or created register
     */
    public static updateOrCreate<T extends EntityTarget>(
        this: T,
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
    ): Promise<InstanceType<T>> {
        return (this as T & typeof BaseEntity)
            .getRepository<Repository<T>>()
            .updateOrCreate(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all registers matched by conditional where options in database
     * @param where - Conditional where options
     * @returns - A result header containing the count of affected registers
     */
    public static delete<T extends EntityTarget>(
        this: T,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<DeleteResult> {
        return (this as T & typeof BaseEntity).getRepository().delete(where)
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    public static getMetadataInstance<T extends EntityTarget>(this: T): (
        EntityMetadata
    ) {
        return MetadataHandler.targetMetadata(this) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private static reply<T extends EntityTarget>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}

export {
    ColumnsSnapshots,
    Collection,
    Pagination,

    type PaginationInitMap
}