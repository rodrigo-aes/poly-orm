import MetadataArray from "../../MetadataArray"

// Types
import type { EntityTarget, Constructor } from "../../../types"
import type { Trigger } from "../../../Triggers"

// Exceptions
import { type MetadataErrorCode } from "../../../Errors"

export default class TriggersMetadata extends MetadataArray<
    Constructor<Trigger>
> {
    constructor(
        public target: EntityTarget,
        ...triggers: Constructor<Trigger>[]
    ) {
        super(target, ...triggers)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): never[] {
        return []
    }

    // ------------------------------------------------------------------------

    protected override get UNIQUE_MERGE_KEYS(): ('name')[] {
        return ['name']
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'triggers-metadata'
    }
}