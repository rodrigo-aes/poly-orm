// Handlers
import MetadataHandler from "../../../MetadataHandler"
import TempMetadata from "../../../TempMetadata"

// Types
import type ScopeMetadata from "../ScopeMetadata"
import type {
    Target,
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types"

import type {
    FindQueryOptions,
    FindOneQueryOptions,
    ConditionalQueryOptions,
    RelationsOptions
} from "../../../../SQLBuilders"

export default class ScopeMetadataHandler {
    public static applyScope<
        T extends Target,
        Type extends 'find' | 'findOne' | 'conditional' | 'relations',
        Options extends (
            Type extends 'find'
            ? FindQueryOptions<InstanceType<T>>
            : Type extends 'findOne'
            ? FindOneQueryOptions<InstanceType<T>>
            : Type extends 'conditional'
            ? ConditionalQueryOptions<InstanceType<T>>
            : Type extends 'relations'
            ? RelationsOptions<InstanceType<T>>
            : never
        )
    >(
        target: T,
        type: Type,
        options: Options
    ): Options {
        const current: ScopeMetadata | undefined = (
            TempMetadata.getScope(target)
            ?? MetadataHandler.targetMetadata(target).scopes?.default
        )

        if (current) switch (type) {
            case 'find': return current.mergeOptions(
                options as FindQueryOptions<InstanceType<T>>,
                true
            ) as Options

            case 'findOne': return current.mergeOptions(
                options as FindQueryOptions<InstanceType<T>>
            ) as Options

            case 'conditional': return current.mergeWhereOptions(options) as (
                Options
            )

            case 'relations': return current.mergeRelationsOptions(
                options as RelationsOptions<InstanceType<T>>
            ) as Options
        }

        return options
    }
}