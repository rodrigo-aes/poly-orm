import MetadataArray from "../../MetadataArray"

import { Collection } from "../../../Entities"
import CollectionsMetadataHandler from "./CollectionsMetadataHandler"

// Types
import type { Target } from "../../../types"
import type { CollectionsMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class CollectionsMetadata<
    T extends Target = Target,
    C extends typeof Collection<InstanceType<T>> = any
> extends MetadataArray<C> {
    public default: typeof Collection = Collection

    constructor(public target: T, ...collections: C[]) {
        super(target, ...collections)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof C | 'name')[] {
        return ['name', 'alias']
    }

    // ------------------------------------------------------------------------

    protected override get UNIQUE_MERGE_KEYS(): (keyof C | 'name')[] {
        return this.SEARCH_KEYS
    }

    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_COLLECTION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'collections-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public setDefault(collection: typeof Collection): void {
        this.default = collection
    }

    // ------------------------------------------------------------------------

    public override toJSON(): CollectionsMetadataJSON {
        return {
            default: this.default,
            collections: super.toJSON()
        }
    }
}

export {
    CollectionsMetadataHandler,

    type CollectionsMetadataJSON
}