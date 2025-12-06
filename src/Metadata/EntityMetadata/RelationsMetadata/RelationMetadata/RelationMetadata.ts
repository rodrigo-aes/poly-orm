// Types
import type { Target, Constructor } from "../../../../types"
import type { RelationType } from "./types"

export default abstract class RelationMetadata {
    public abstract readonly fillMethod: string

    constructor(public target: Target, public name: string) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get relatedTarget(): Target

    // ------------------------------------------------------------------------

    public get type(): RelationType {
        return this.constructor.name.replace('Metadata', '') as RelationType
    }

    // instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract toJSON(): any

    // ------------------------------------------------------------------------

    public reply<T extends RelationMetadata>(
        this: T,
        target: Target,
        name: string
    ): RelationMetadata {
        const replic = new (this.constructor as Constructor<RelationMetadata>)(
            target, {}
        )

        Object.assign(replic, { ...this, name })
        return replic
    }
}