// Handlers
import MetadataHandler from "../../../MetadataHandler"
import TempMetadata from "../../../TempMetadata"

// Types
import type { Target } from "../../../../types"
import type {
    FindQueryOptions,
    FindOneQueryOptions,
    ConditionalQueryOptions,
    RelationsOptions
} from "../../../../SQLBuilders"

export default class ScopeMetadataHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static apply<
        T extends Target,
        R extends 'find' | 'findOne' | 'conditional' | 'relations',
        O extends (
            R extends 'find'
            ? FindQueryOptions<InstanceType<T>>
            : R extends 'findOne'
            ? FindOneQueryOptions<InstanceType<T>>
            : R extends 'conditional'
            ? ConditionalQueryOptions<InstanceType<T>>
            : R extends 'relations'
            ? RelationsOptions<InstanceType<T>>
            : never
        )
    >(target: T, role: R, options?: O): O {
        return (
            TempMetadata.getScope(target)
            ?? MetadataHandler.targetMetadata(target).scopes?.default as any
        )[(() => {
            switch (role) {
                case 'find': return 'mergeFindOptions'
                case 'findOne': return 'mergeFindOptions'
                case 'conditional': return 'mergeConditionalOptions'
                case 'relations': return 'mergeRelationsOptions'
            }
        })()](options) ?? options
    }
}