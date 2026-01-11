import { ColumnsMetadata } from "../../Metadata"
import type { Entity, EntityTarget } from "../../types"

export default function Check<T extends Entity>(...constraints: string[]) {
    return function (
        target: T,
        name: string
    ) {
        ColumnsMetadata
            .findOrBuild(target.constructor as EntityTarget)
            .addCheck(name, ...constraints)
    }
}