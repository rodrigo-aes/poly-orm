import 'reflect-metadata'

import { ColumnsMetadata, type DataType } from '../../Metadata'
import type { Entity, EntityTarget } from '../../types'

export default function Column<T extends Entity>(dataType: DataType) {
    return function (
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumn(name, dataType)
    }
}