import type { Pagination, Collection } from "../../../Entities"

export type PaginationsMetadataJSON = {
    default: typeof Pagination<Collection>
    paginations: (typeof Pagination<Collection>)[]
}
