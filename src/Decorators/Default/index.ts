import { ColumnsMetadata } from "../../Metadata"
import type { Entity, EntityTarget } from "../../types"

export default function Default<T extends Entity>(value: any) {
    return function (
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { defaultValue: value })
    }
}