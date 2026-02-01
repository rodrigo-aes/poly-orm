import { CollectionsMetadata } from "../../Metadata"

// Types
import type { Target, Constructor } from "../../types"
import type { Collection } from "../../Entities"

export default function DefaultCollection(
    collection: Constructor<Collection<any>>
) {
    return function <T extends Target>(target: T) {
        CollectionsMetadata.findOrBuild(target).setDefault(collection)
    }
}