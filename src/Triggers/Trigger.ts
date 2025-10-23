import TriggerActionBuilder from "./TriggerActionBuilder"

// Metadata
import { MetadataHandler, type EntityMetadata } from "../Metadata"

// Types
import type { Constructor } from "../types"
import type BaseEntity from "../BaseEntity"
import type {
    TriggerEvent,
    TriggerTiming,
    TriggerOrientation,
    TriggerAction
} from "./types"

export default abstract class Trigger<
    T extends BaseEntity = BaseEntity
> extends TriggerActionBuilder<Constructor<T>> {
    /** @internal */
    protected metadata: EntityMetadata

    public abstract get event(): TriggerEvent
    public abstract get timing(): TriggerTiming
    public abstract get orientation(): TriggerOrientation

    constructor(public target: Constructor<T>) {
        super()

        this.metadata = MetadataHandler.targetMetadata(this.target) as (
            EntityMetadata
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get tableName(): string {
        return this.metadata.tableName
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return this.constructor.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract action(): string | TriggerAction<T>[]
}