import type { Constructor } from "../../../types"
import type { Collection } from "../../../Entities"

export type CollectionsMetadataJSON = {
    default: Constructor<Collection<any>>
    collections: Constructor<Collection<any>>[]
}