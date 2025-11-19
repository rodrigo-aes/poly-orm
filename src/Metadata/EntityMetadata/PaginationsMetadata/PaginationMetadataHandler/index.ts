import { Pagination, type PaginationInitMap } from "../../../../Entities"
import PaginationMetadata from ".."
import TempMetadata from "../../../TempMetadata"
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types"

export default class PaginationMetadataHandler {
    public static loadPagination(target: EntityTarget | PolymorphicEntityTarget): (
        typeof Pagination
    ) {
        return TempMetadata.getPagination(target)
            ?? PaginationMetadata.find(target)?.default
            ?? Pagination
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T,
        initMap: PaginationInitMap,
        entities: InstanceType<T>[],
    ): Pagination<InstanceType<T>> {
        return this.loadPagination(target).build(
            initMap,
            entities
        )
    }
}