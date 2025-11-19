import { Collection } from "../../../../Entities"
import CollectionsMetadata from ".."
import TempMetadata from "../../../TempMetadata"

// Types
import type { Target } from "../../../../types"

export default class CollectionsMetadataHandler {
    public static loadCollection(target: Target): (
        typeof Collection
    ) {
        return TempMetadata.getCollection(target)
            ?? CollectionsMetadata.find(target)?.default
            ?? Collection
    }

    // ------------------------------------------------------------------------

    public static build<T extends Target>(
        target: T,
        entities: InstanceType<T>[]
    ): Collection<InstanceType<T>> {
        return new (this.loadCollection(target))(...entities)
    }
}