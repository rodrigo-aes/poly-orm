// Types
import type { Target, Constructor } from "../../../../types"
import { Collection } from "../../../../Entities"
import type { RelationType } from "./types"

export default abstract class RelationMetadata<T extends 'One' | 'Many' = any> {
    public abstract readonly fillMethod: T
    public collection?: T extends 'Many'
        ? Constructor<Collection<any>>
        : never

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