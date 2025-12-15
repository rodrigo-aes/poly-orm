import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"
import type { Repository, PolymorphicRepository } from "../../Repositories"

export default function UseRepository<
    R extends typeof Repository | typeof PolymorphicRepository,
>(repository: R) {
    return function (target: (
        R extends typeof Repository
        ? EntityTarget
        : R extends typeof PolymorphicRepository
        ? PolymorphicEntityTarget
        : never
    )) {
        MetadataHandler.targetMetadata(target as any).defineRepository(
            repository as any
        )
    }
}