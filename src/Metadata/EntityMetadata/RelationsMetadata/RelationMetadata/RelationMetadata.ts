// Types
import type { Target, Constructor } from "../../../../types"
import type { Collection } from "../../../../Entities"
import type { RelationType, RelationMetadata as Concret } from "./types"

export default abstract class RelationMetadata<
    T extends 'One' | 'Many' = 'One' | 'Many'
> {
    public abstract readonly fillMethod: T
    public readonly type: RelationType = (
        this.constructor.name.replace('Metadata', '') as RelationType
    )
    public collection?: T extends 'Many'
        ? Constructor<Collection<any>>
        : never

    public name!: string
    constructor(public target: Target) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get relatedTarget(): Target

    // instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract toJSON(): any

    // ------------------------------------------------------------------------

    public reply<T extends Concret>(
        this: T,
        target: Target,
        name: string
    ): T {
        return Object.assign(
            new (this.constructor as Constructor<T>)(target, {}),
            { ...this, name }
        )
    }
}