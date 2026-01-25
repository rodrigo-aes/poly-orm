import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { ResultSetHeader } from "mysql2"
import type { ConditionalQueryOptions } from "../../../SQLBuilders"

export default function AfterBulkUpdate<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<T> | undefined,
        result: ResultSetHeader
    ) => void | Promise<void>>
) {
    HooksMetadata
        .findOrBuild(target.constructor as EntityTarget)
        .add('afterBulkUpdate', propertyName)
}