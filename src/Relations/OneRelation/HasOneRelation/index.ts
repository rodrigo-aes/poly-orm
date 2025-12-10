import OneRelation from ".."

// Types
import type { Constructor, Entity } from "../../../types"

import type {
    HasOneMetadata,
    PolymorphicHasOneMetadata,
} from "../../../Metadata"

import type {
    RelationCreationAttributes,
    RelationUpdateOrCreateAttributes,
} from "../../../SQLBuilders"

/**
 * Has one relation handler
 */
export default abstract class HasOneRelation<
    T extends Entity,
    R extends Entity
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneMetadata | PolymorphicHasOneMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
    ) {
        super(metadata, target, related, instance)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a related entity in database
     * @param attributes - Related creation attributes data
     * @returns - Instance of created related entity
     */
    public async create(attributes: RelationCreationAttributes<R>): Promise<
        this
    > {
        this.instance = await this.queryExecutionHandler.executeCreate(
            this.sqlBuilder.createSQL(attributes),
            (this.sqlBuilder.creationAttributes as any)(attributes)
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a related entity in database
     * @param attributes - Related update or create attributes data
     * @returns - Instance of updated or created related entity
     */
    public async updateOrCreate(
        attributes: RelationUpdateOrCreateAttributes<R>
    ): Promise<this> {
        this.instance = await this.queryExecutionHandler.executeUpdateOrCreate(
            this.sqlBuilder.updateOrCreateSQL(attributes)
        )

        return this
    }
}