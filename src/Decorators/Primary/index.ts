import { ColumnsMetadata } from "../../Metadata"
import type { Entity, EntityTarget } from "../../types"

export default function Primary<T extends Entity>(
    primary: boolean = true
) {
    return function (
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { primary })

    }
}