import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"
import { Repository, PolymorphicRepository } from "../../Repositories"

export default function UseRepository<T extends (
    typeof Repository |
    typeof PolymorphicRepository
)>(repository: T) {
    return function (
        target: T extends typeof Repository
            ? EntityTarget
            : T extends typeof PolymorphicRepository
            ? PolymorphicEntityTarget
            : never
    ) {
        MetadataHandler.targetMetadata(target).defineRepository(
            repository as any
        )
    }
}