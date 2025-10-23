import MetadataMap from "../../MetadataMap"

import ScopeMetadata from "./ScopeMetadata"
import ScopeMetadataHandler from "./ScopeMetadataHandler"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

import type { FindQueryOptions } from "../../../SQLBuilders"
import type { Scope, ScopeFunction, ScopesMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class ScopesMetadata extends MetadataMap<
    string,
    ScopeMetadata | ScopeFunction
> {
    public default?: ScopeMetadata

    constructor(
        public target: EntityTarget | PolymorphicEntityTarget,
        scopes?: { [K: string]: Scope }
    ) {
        super()
        this.init()

        if (scopes) this.registerScopes(scopes)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_SCOPE'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'scopes-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getScope(name: string, ...args: any[]): ScopeMetadata | undefined {
        const value = this.get(name)
        if (!value) return

        return typeof value === 'object'
            ? value
            : new ScopeMetadata(value(...args))
    }

    // ------------------------------------------------------------------------

    public setDefault<T extends EntityTarget | PolymorphicEntityTarget = any>(
        scope: FindQueryOptions<InstanceType<T>>
    ): void {
        this.default = new ScopeMetadata(scope)
    }

    // ------------------------------------------------------------------------

    public registerScopes(scopes: { [K: string]: Scope }): void {
        for (const [name, scope] of Object.entries(scopes)) this.set(
            name,
            typeof scope === 'object'
                ? new ScopeMetadata(scope)
                : scope
        )

    }

    // ------------------------------------------------------------------------

    public toJSON(): ScopesMetadataJSON {
        return {
            default: this.default?.toJSON(),
            ...Object.fromEntries(this.entries())
        }
    }
}

export {
    ScopeMetadata,
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction,
    type ScopesMetadataJSON
}