import PaginationsMetadata from ".."
import {
    Pagination,
    Collection,
    type PaginationInitMap
} from "../../../../Entities"

import { CollectionsMetadataHandler } from "../../CollectionsMetadata"

// Types
import type { Entity, Constructor } from "../../../../types"
import type {
    EntityPaginateOption,
    EntityCollectOption
} from "../../../../Handlers"

export default class PaginationMetadataHandler {
    public static loadPagination<T extends Entity>(
        target: Constructor<T>,
        pagination: EntityPaginateOption<T> = Pagination
    ): typeof Pagination<Collection<T>> {
        switch (typeof pagination) {
            case "function": return pagination as any

            // ----------------------------------------------------------------

            case "string": return PaginationsMetadata
                .findOrBuild(target)
                .findOrThrow(pagination) as any

            // ----------------------------------------------------------------

            default: return (
                PaginationsMetadata.find(target)?.default ?? Pagination
            ) as any
        }
    }

    // ------------------------------------------------------------------------

    public static build<T extends Entity>(
        target: Constructor<T>,
        pagination: EntityPaginateOption<T> = Pagination,
        collection: EntityCollectOption<T> = Collection,
        initMap: PaginationInitMap,
        data: T[],
    ): Pagination<Collection<T>> {
        return this.loadPagination(target, pagination).build(
            initMap,
            data instanceof Collection
                ? data
                : CollectionsMetadataHandler.build(target, collection, data)
        )
    }
}