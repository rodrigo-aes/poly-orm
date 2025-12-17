import type { Pagination } from "../../../Entities"

export type PaginationsMetadataJSON = {
    default: typeof Pagination
    paginations: (typeof Pagination)[]
}
