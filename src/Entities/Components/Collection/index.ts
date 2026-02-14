import { ComputedPropertiesMetadata } from "../../../Metadata"

// Types
import type {
    Entity,
    CollectionTarget
} from "../../../types"

import type { CreateAttributes, UpdateAttributes } from "../../../SQLBuilders"
import type { CollectionJSON } from "./types"

export default class Collection<
    T extends Entity = Entity,
    A extends string = string
> extends Array<T> {
    public static readonly __alias: string = this.name

    /** @internal */
    declare readonly __$alias: A

    // ------------------------------------------------------------------------

    /** @internal */
    public static readonly __$registered = new Set<string>()

    /** @internal */
    private __$CPMeta?: ComputedPropertiesMetadata

    /** @internal */
    private __$CPKeys?: (keyof this)[]

    constructor(...entities: T[]) {
        super(...entities)
        this.__$cpMeta?.assign(this)
    }

    // Getters ================================================================
    // Publics ---------------------------------------------------------------
    /**
     * An array of properties keys that must be hidden in JSON
     */
    public get hidden(): (keyof this)[] {
        return []
    }

    // ------------------------------------------------------------------------

    /**
     * An array of properties keys that must be included in JSON
     */
    public get include(): (keyof this)[] {
        return []
    }

    // Privates ---------------------------------------------------------------
    /** 
     * Computed properties metadata
     * @internal
     * */
    private get __$cpMeta(): ComputedPropertiesMetadata | undefined {
        return this.__$CPMeta ??= ComputedPropertiesMetadata.find(
            this.constructor as CollectionTarget
        )
    }

    // ------------------------------------------------------------------------

    /** 
     * Computed properties keys
     * @internal
     * */
    private get __$cpKeys(): (keyof this)[] {
        return this.__$CPKeys ??= Array
            .from(this.__$cpMeta?.keys() ?? [])
            .filter(key => !this.hidden.includes(key as keyof this)) as (
                keyof this
            )[]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of collection and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON<T extends Collection>(this: T): CollectionJSON<T> {
        return this.__$cpMeta || this.include.length
            ? this.__$buildJSON()
            : Array.from(this) as any
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entities properties with a data object
     * @returns {this} - Same entity instance
     */
    public fillAll(data: UpdateAttributes<T>): this {
        for (const entity of this) entity.fill(data)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of each entity of collection in database
     * @returns {this} - Same collection instance
     */
    public async save(): Promise<this> {
        for (const entity of this) if (entity.__$shouldUpdate) (
            await (entity as any).save()
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of each entity of collection in database
     * @param {UpdateAttributes<this>} attributes -  Attributes data to update
     * @returns {this} - Same collection instance
     */
    public async update(
        attributes: UpdateAttributes<T>,
        predicate?: (value: T, index: number, array: T[]) => boolean
    ): Promise<T[]> {
        const entities = predicate ? this.filter(predicate) : this
        for (const entity of entities) await (entity as any).update(
            attributes
        )

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of each entoity instance matched by filter fn
     */
    public async delete(
        predicate: (value: T, index: number, array: T[]) => boolean
    ): Promise<this> {
        for (const entity of this.filter(predicate)) (
            await (this.splice(this.indexOf(entity), 1)[0] as any).delete()
        )

        return this
    }

    // Privates ---------------------------------------------------------------
    /** 
     * Collection JSON
     * @internal
     * */
    private __$buildJSON(): any {
        return {
            ...this.__$cpJSON(),
            ...this.__$includedJSON(),
            data: this.map(entity => entity.toJSON()),
        }
    }

    // ------------------------------------------------------------------------

    /** 
     * Make computed properties JSON object
     * @internal 
     * */
    private __$cpJSON(): any {
        return Object.fromEntries(this.__$cpKeys.flatMap(
            key => this.hidden.includes(key)
                ? []
                : [[key, this[key]]]
        ))
    }

    // ------------------------------------------------------------------------

    private __$includedJSON(): any {
        return Object.fromEntries(this.include.flatMap(
            key => this.hidden.includes(key)
                ? []
                : [[key, this[key]]]
        ))
    }
}

export type {
    CollectionJSON
}