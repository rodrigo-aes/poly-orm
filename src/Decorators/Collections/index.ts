import { CollectionsMetadata } from "../../Metadata"

// Decorators
import DefaultCollection from "./DefaultCollection"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"
import type { Collection } from "../../Entities"

export default function Collections(...collections: (typeof Collection)[]) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        CollectionsMetadata.findOrBuild(target, ...collections)
    }
}

export {
    DefaultCollection
}