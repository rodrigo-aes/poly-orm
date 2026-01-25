import type {
    Target,
    EntityTarget
} from "../../../../types"

import type { HookType, HookFunction, HookMetadataJSON } from "./types"

// Exceptions
import PolyORMException from "../../../../Errors"

export default abstract class HookMetadata {
    constructor(
        public target: Target,
        public method: string
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return (this.constructor as typeof HookMetadata).type
    }

    // ------------------------------------------------------------------------

    public get hookFn(): HookFunction {
        return this.target[this.method as keyof EntityTarget]
    }

    // Static Getters =======================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        throw PolyORMException.Common.instantiate(
            'UNIMPLEMENTED_GET', 'type', this.name
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract call(...args: any[]): void | Promise<void>

    // ------------------------------------------------------------------------

    public toJSON(): HookMetadataJSON {
        return {
            type: this.type,
            method: this.method,
            hookFn: this.hookFn
        }
    }
}