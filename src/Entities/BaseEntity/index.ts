import Entity from "../Entity"

// Query Builder
import { EntityQueryBuilder } from "../../QueryBuilder"

// Types
import type { ResultSetHeader } from "mysql2"

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

import type { Repository } from "../../Repositories"
import type { RelationHandler } from "../../Relations"

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

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository<T extends Repository<this> = Repository<this>>(): T {
        return this.__$trueMetadata.getRepository() as T
    }

    // ------------------------------------------------------------------------

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
    public async save<T extends BaseEntity>(this: T): Promise<T> {
        const instance = await this.getRepository().updateOrCreate(this)
        await this.__$saveRelations()

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of the current instance in database
     * @param {UpdateAttributes<this>} attributes -  Attributes data to update
     * @returns {this} - Same entity instance
     */
    public async update<T extends BaseEntity>(
        this: T,
        attributes: UpdateAttributes<T>
    ): Promise<ResultSetHeader> {
        return this.getRepository().update(attributes, this.__$wherePK) as (
            Promise<ResultSetHeader>
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the current instance in database
     */
    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        await this.getRepository().delete(this.__$wherePK)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getRepository<
        T extends EntityTarget,
        R extends Repository<InstanceType<T>>
    >(this: T): R {
        return (this as StaticEntityTarget<T>)
            .__$trueMetadata
            .getRepository() as R
    }

    // ------------------------------------------------------------------------

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
        return (this as any).getRepository().create(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a entity instance 
     * collection by created resgiters
     * @param attributes - An array list for each register entity creation
     * attributes
     * @returns - A entity instance collection for created registers
     */
    public static createMany<T extends BaseEntity>(
        this: Constructor<T>,
        attributes: CreationAttributes<T>[]
    ): Promise<T[]> {
        return (this as any).getRepository().createMany(attributes)
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public static update<T extends BaseEntity>(
        this: Constructor<T>,
        attributes: UpdateAttributes<T>,
        where: ConditionalQueryOptions<T>
    ): Promise<ResultSetHeader> {
        return (this as any).getRepository().update(attributes, where)
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
        return (this as any).getRepository().updateOrCreate(attributes)
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
        return (this as any).getRepository().delete(where)
    }
}