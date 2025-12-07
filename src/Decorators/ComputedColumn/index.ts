import 'reflect-metadata'

import {
    ColumnsMetadata,
    DataType,

    type ComputedType
} from '../../Metadata'

// Types
import type { Entity, EntityTarget } from '../../types'

export default function ComputedColumn<T extends Entity>(
    dataType: DataType,
    as: string,
    type: ComputedType = 'STORED'
) {
    return function (
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumn(name, DataType.COMPUTED(dataType, as, type))
    }
}