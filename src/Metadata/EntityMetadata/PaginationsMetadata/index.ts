import MetadataArray from "../../MetadataArray"
import { Pagination } from "../../../Entities"

// Handlers
import PaginationMetadataHandler from "./PaginationMetadataHandler"

// Types
import type { Entity, Constructor } from "../../../types"
import type { PaginationsMetadataJSON } from "./types"
// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class PaginationsMetadata<
    T extends Entity = Entity,
    P extends typeof Pagination<T> = any
> extends MetadataArray<P> {
    public default: typeof Pagination = Pagination

    constructor(public target: Constructor<T>, ...collections: P[]) {
        super(target, ...collections)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof P | 'name')[] {
        return ['name', 'alias']
    }

    // ------------------------------------------------------------------------

    protected override get UNIQUE_MERGE_KEYS(): (keyof P | 'name')[] {
        return this.SEARCH_KEYS
    }

    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_PAGINATION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'paginations-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public setDefault(pagination: typeof Pagination): void {
        this.default = pagination
    }

    // ------------------------------------------------------------------------

    public override toJSON(): PaginationsMetadataJSON {
        return {
            default: this.default,
            paginations: super.toJSON()
        }
    }
}

export {
    PaginationMetadataHandler,
    type PaginationsMetadataJSON
}