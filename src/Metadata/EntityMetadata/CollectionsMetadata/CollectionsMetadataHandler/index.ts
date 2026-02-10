import { Collection } from "../../../../Entities"
import CollectionsMetadata from ".."

// Types
import type { Entity, Constructor } from "../../../../types"
import type { EntityCollectOption } from "../../../../Handlers"

export default class CollectionsMetadataHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static loadCollection<T extends Entity>(
        target: Constructor<T>,
        collection: EntityCollectOption<T> = Collection
    ): Constructor<Collection<T>> {
        switch (typeof collection) {
            case "function": return collection as any

            // ----------------------------------------------------------------

            case "string": return CollectionsMetadata
                .findOrBuild(target)
                .findOrThrow(collection) as any

            // ----------------------------------------------------------------

            default: return CollectionsMetadata.find(target)?.default
                ?? Collection
        }
    }

    // ------------------------------------------------------------------------

    public static build<T extends Entity>(
        target: Constructor<T>,
        collection: EntityCollectOption<T> = Collection,
        entities: T[] = []
    ): Collection<T> {
        return new (this.loadCollection(target, collection))(...entities)
    }
}