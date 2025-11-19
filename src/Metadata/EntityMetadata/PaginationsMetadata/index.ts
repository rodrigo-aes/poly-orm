import CollectionsMetadata from "../CollectionsMetadata"
import { Pagination } from "../../../Entities"

// Handlers
import PaginationMetadataHandler from "./PaginationMetadataHandler"

// Types
import type { Target } from "../../../types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class PaginationsMetadata<
    T extends Target = Target,
    P extends typeof Pagination<InstanceType<T>> = any
> extends CollectionsMetadata<T, P> {
    public override default: typeof Pagination = Pagination

    constructor(public target: Target, ...collections: P[]) {
        super(target, ...collections)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_PAGINATION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'paginations-metadata'
    }
}

export {
    PaginationMetadataHandler
}