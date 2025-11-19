import { CollectionsMetadata } from "../../../Metadata"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types"
import type { Collection } from "../../../Entities"

export default function DefaultCollection(collection: typeof Collection) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        CollectionsMetadata.findOrBuild(target).setDefault(collection)
    }
}