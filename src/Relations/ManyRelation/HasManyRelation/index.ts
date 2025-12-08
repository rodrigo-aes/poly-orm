import util from "util"

import ManyRelation from ".."
import { Collection } from "../../../Entities"

// Types
import type { Constructor, Entity } from "../../../types"
import type {
    HasManyMetadata,
    PolymorphicHasManyMetadata,
    BelongsToManyMetadata
} from "../../../Metadata"

import type {
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../../SQLBuilders"

/** Has many relation handler */
export default abstract class HasManyRelation<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> extends ManyRelation<T, R, C> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: (
            HasManyMetadata |
            PolymorphicHasManyMetadata |
            BelongsToManyMetadata
        ),

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        ),

        /** @internal */
        protected instances: C = new collection
    ) {
        super(metadata, target, related, collection, instances)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public [util.inspect.custom]() {
        return this.instances
    }

    // ------------------------------------------------------------------------

    /**
     * Create a related entity register and return instance
     * @param attributes - Related entity creation attributes
     * @returns - Related entity instance
     */
    public async create(attributes: CreationAttributes<R>): Promise<R> {
        const instance = await this.queryExecutionHandler.executeCreate(
            this.sqlBuilder.createSQL(attributes),
            attributes
        )
        this.instances.push(instance)

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Create many related entity registers and return instances
     * @param attributes - An array of creation attributes data
     * @returns - Related entity instances
     */
    public async createMany(attributes: CreationAttributes<R>[]): Promise<R[]> {
        const instances = await this.queryExecutionHandler.executeCreateMany(
            this.sqlBuilder.createManySQL(attributes),
            attributes
        )
        this.instances.push(...instances)

        return instances
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a entity register
     * @param attributes - Update or create attributes data
     * @returns - Related entity instance
     */
    public async updateOrCreate(attributes: UpdateOrCreateAttibutes<R>): (
        Promise<R>
    ) {
        const instance = await this.queryExecutionHandler.executeUpdateOrCreate(
            this.sqlBuilder.updateOrCreateSQL(attributes)
        )
        this.instances.push(instance)

        return instance
    }
}