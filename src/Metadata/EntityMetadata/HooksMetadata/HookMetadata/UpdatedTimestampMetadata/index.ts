import BeforeUpdateMetadata from "../BeforeUpdateMetadata"

// Types
import type { Target } from "../../../../../types"
import type { HookFunction, HookType } from "../types"

// Exceptions
import PolyORMException from "../../../../../Errors"

export default class UpdatedTimestampMetadata extends BeforeUpdateMetadata {
    constructor(
        public target: Target
    ) {
        super(target, '')
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get type(): HookType {
        return 'beforeUpdate'
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get hookFn(): HookFunction {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD',
            'hookFn'
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: any) {
        attributes.updatedAt = new Date
    }
}