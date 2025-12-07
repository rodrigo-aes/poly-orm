import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { Entity, EntityTarget } from "../../types"

export default function UpdatedTimestamp<T extends Entity>(
    target: T,
    name: string
) {
    ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
        .registerColumnPattern(name, 'updated-timestamp')
}