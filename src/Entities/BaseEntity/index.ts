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

import type { DeleteResult } from "../../Handlers"

import type {
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttibutes,
    ConditionalQueryOptions,
} from "../../SQLBuilders"

import type { Repository } from "../../Repositories"

/**
 * All entities needs to extends BaseEntity class
 * @example
 * class User extends BaseEntity {}
 */
export default abstract class BaseEntity extends Entity {
    /** Entity name */
    public abstract readonly name: string

    public static readonly INHERIT_POLYMORPHIC_RELATIONS = false

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository<T extends Repository<this> = Repository<this>>(): T {
        return this.getTrueMetadata().getRepository() as T
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
        return this.getRepository().updateOrCreate(this, 'json') as Promise<T>
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
        return this.getRepository().update(
            attributes,
            this._wherePK
        ) as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the current instance in database
     */
    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        await this.getRepository().delete(this._wherePK)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getRepository<
        T extends EntityTarget,
        R extends Repository<InstanceType<T>>
    >(this: T): R {
        return (this as StaticEntityTarget<T>)
            .getTrueMetadata()
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
    public static create<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return (
            (this as StaticEntityTarget<T>)
                .getRepository() as Repository<InstanceType<T>>
        )
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
        return (
            (this as StaticEntityTarget<T>)
                .getRepository() as Repository<InstanceType<T>>
        )
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
        return (
            (this as StaticEntityTarget<T>)
                .getRepository() as Repository<InstanceType<T>>
        )
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
        return (
            (this as StaticEntityTarget<T>)
                .getRepository() as Repository<InstanceType<T>>
        )
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
        return (this as StaticEntityTarget<T>).getRepository().delete(where)
    }
}