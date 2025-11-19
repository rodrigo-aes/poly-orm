import type { Collection } from "../../../Entities"

export type CollectionsMetadataJSON = {
    default: typeof Collection
    collections: (typeof Collection)[]
}