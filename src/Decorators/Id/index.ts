import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { EntityTarget } from "../../types"

export default function Id(
    target: Object,
    name: string
) {
    ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
        .registerColumnPattern(name, 'id')
}