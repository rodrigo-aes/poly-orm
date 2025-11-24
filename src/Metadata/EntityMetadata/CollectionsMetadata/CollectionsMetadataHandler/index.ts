import { Collection } from "../../../../Entities"
import CollectionsMetadata from ".."
import TempMetadata from "../../../TempMetadata"

// Types
import type { ConcretTarget } from "../../../../types"

export default class CollectionsMetadataHandler {
    public static loadCollection(target: ConcretTarget): typeof Collection {
        return TempMetadata.getCollection(target)
            ?? CollectionsMetadata.find(target)?.default
            ?? Collection
    }

    // ------------------------------------------------------------------------

    public static build<T extends ConcretTarget>(
        target: T,
        entities: InstanceType<T>[]
    ): Collection<InstanceType<T>> {
        return new (this.loadCollection(target))(...entities) as Collection<
            InstanceType<T>
        >
    }
}