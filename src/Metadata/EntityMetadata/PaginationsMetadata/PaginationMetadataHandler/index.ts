import {
    Pagination,
    Collection,
    type PaginationInitMap
} from "../../../../Entities"
import PaginationMetadata from ".."
import TempMetadata from "../../../TempMetadata"
import { CollectionsMetadataHandler } from "../../CollectionsMetadata"

// Types
import type { Entity, Target, Constructor } from "../../../../types"

export default class PaginationMetadataHandler {
    public static loadPagination(target: Target): typeof Pagination {
        return TempMetadata.getPagination(target)
            ?? PaginationMetadata.find(target)?.default
            ?? Pagination
    }

    // ------------------------------------------------------------------------

    public static build<T extends Entity>(
        target: Constructor<T>,
        initMap: PaginationInitMap,
        data: Collection<T> | T[],
    ): Pagination<T> {
        return this.loadPagination(target).build(
            initMap,
            data instanceof Collection
                ? data
                : CollectionsMetadataHandler.build(target, data)
        )
    }
}