import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../../types"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { RelationOptions } from "../types"
import type { EntityTargetGetter } from "../types"

// Polymorphic Parent =========================================================
export type PolymorphicTargetGetter = () => (
    EntityTarget[] | PolymorphicEntityTarget
)

export interface PolymorphicParentOptions extends RelationOptions {
    related: PolymorphicTargetGetter,
    FK: string
    TK?: string
    scope?: ConditionalQueryOptions<any>
}

// Polymorphic Child ==========================================================
export interface PolymorphicChildOptions extends RelationOptions {
    related: EntityTargetGetter
    FK: string
    TK?: string
    scope?: ConditionalQueryOptions<any>
}