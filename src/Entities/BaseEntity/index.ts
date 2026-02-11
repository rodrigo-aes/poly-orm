import Entity from "../Entity"

// Repository
import { Repository } from "../../Repositories"

// Query Builder
import { EntityQueryBuilder } from "../../QueryBuilder"

// Types
import type {
    EntityTarget,
    Constructor,
    StaticEntityTarget,
} from "../../types"

import type { Collection, Pagination } from "../Components"
import type { DeleteResult } from "../../Handlers"

import type {
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttributes,
    ConditionalQueryOptions
} from "../../SQLBuilders"

import type {
    CreateResult,
    UpdateResult,
    CreateCollectMapOptions
} from "../../Handlers"

/**
 * All entities needs to extends BaseEntity class
 * @example
 * class User extends BaseEntity {}
 */
export default abstract class BaseEntity extends Entity {
    declare readonly __name: string
    declare readonly __defaultCollection: Collection<this>
    declare readonly __defaultPagination: Pagination<
        this['__defaultCollection']
    >

    public static readonly INHERIT_POLYMORPHIC_RELATIONS = false

    constructor() {
        super()

        Object.defineProperty(this, '__name', {
            get() { return this.constructor.name },
            enumerable: false,
        })
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get Repository(): typeof Repository {
        return Repository
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getQueryBuilder<T extends BaseEntity>(this: T): EntityQueryBuilder<
        T
    > {
        return new EntityQueryBuilder(this.constructor as Constructor<T>)
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of the current instance in database
     * @returns {this} - Same entity instance
     */
    public async save<T extends BaseEntity>(
        this: T,
        attributes?: UpdateAttributes<T>
    ): Promise<T> {
        return (await
            new BaseEntity
                .Repository(this.constructor as Constructor<T>)
                .updateOrCreate(attributes ? this.fill(attributes) : this)
        )
            .__$saveRelations()
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the current instance in database
     */
    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        await new BaseEntity
            .Repository(this.constructor as Constructor<T>)
            .delete(this.__$wherePK)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getQueryBuilder<T extends EntityTarget>(this: T): (
        EntityQueryBuilder<InstanceType<T>>
    ) {
        return new EntityQueryBuilder(this as any)
    }

    // ------------------------------------------------------------------------

    /**
     * Create a register in database and returns a entity instance by created
     * register
     * @param attributes - Entity creation attributes
     * @returns - A entity instance for created register
     */
    public static create<T extends BaseEntity>(
        this: Constructor<T>,
        attributes: CreationAttributes<T>
    ): Promise<T> {
        return new (this as StaticEntityTarget<T>)
            .Repository(this)
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
    public static createMany<
        T extends BaseEntity,
        M extends CreateCollectMapOptions<T>
    >(
        this: Constructor<T>,
        attributes: CreationAttributes<T>[],
        options?: M
    ): Promise<CreateResult<T, M['collection']>> {
        return new (this as StaticEntityTarget<T>)
            .Repository(this)
            .createMany(attributes, options)
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public static update<
        T extends BaseEntity,
        A extends T | UpdateAttributes<T>
    >(
        this: Constructor<T>,
        attributes: A,
        where: ConditionalQueryOptions<T>
    ): Promise<UpdateResult<T, A>> {
        return new (this as StaticEntityTarget<T>)
            .Repository(this)
            .update(attributes, where)
    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent register matched by attributes data or create a new
     * @param attributes - Update or create attributes data 
     * @returns - A entity instance for updated or created register
     */
    public static updateOrCreate<T extends BaseEntity>(
        this: Constructor<T>,
        attributes: UpdateOrCreateAttributes<T>,
    ): Promise<T> {
        return new (this as StaticEntityTarget<T>)
            .Repository(this)
            .updateOrCreate(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all registers matched by conditional where options in database
     * @param where - Conditional where options
     * @returns - A result header containing the count of affected registers
     */
    public static delete<T extends BaseEntity>(
        this: Constructor<T>,
        where: ConditionalQueryOptions<T>
    ): Promise<DeleteResult> {
        return new (this as StaticEntityTarget<T>)
            .Repository(this)
            .delete(where)
    }
}