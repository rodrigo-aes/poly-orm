import { ComputedPropertiesMetadata } from "../../../Metadata"

// Types
import type {
    Entity,
    CollectionTarget,
    EntityProperties,
} from "../../../types"
import type { UpdateAttributes } from "../../../SQLBuilders"

export default class Collection<T extends Entity> extends Array<T> {
    public static readonly alias: string = this.name

    /** @internal */
    public readonly shouldUpdate: boolean = true

    /** @internal */
    public static readonly __registered = new Set<string>()

    /** @internal */
    private _CPMeta?: ComputedPropertiesMetadata

    /** @internal */
    private _CPKeys?: (keyof this)[]

    constructor(...entities: T[]) {
        super(...entities)
        this.CPMeta?.assign(this)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /**
     * An array of properties keys that must be hidden in JSON
     */
    protected get hidden(): string[] {
        return []
    }

    // ------------------------------------------------------------------------

    /**
     * An array of properties keys that must be included in JSON
     */
    protected get include(): string[] {
        return []
    }

    // Privates ---------------------------------------------------------------
    /** 
     * Computed properties metadata
     * @internal
     * */
    private get CPMeta(): ComputedPropertiesMetadata | undefined {
        return this._CPMeta ??= ComputedPropertiesMetadata.find(
            this.constructor as CollectionTarget
        )
    }

    // ------------------------------------------------------------------------

    /** 
     * Computed properties keys
     * @internal
     * */
    private get CPKeys(): (keyof this)[] {
        return this._CPKeys ??= Array
            .from(this.CPMeta?.keys() ?? [])
            .filter(key => !this.hidden.includes(key)) as (keyof this)[]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of collection and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON(this: Collection<T>) {
        return this.CPMeta || this.include.length
            ? this.buildJSON()
            : this
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entities properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill(data: Partial<EntityProperties<T>>): this {
        for (const entity of this) entity.fill(data)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of each entity of collection in database
     * @returns {this} - Same collection instance
     */
    public async save(): Promise<this> {
        for (const entity of this) if (entity.shouldUpdate) (
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
    public async delete(predicate: (value: T, index: number, array: T[]) => (
        boolean
    )): Promise<this> {
        for (const entity of this.filter(predicate)) await (
            this.splice(this.indexOf(entity), 1)[0] as any
        )
            .delete()

        return this
    }

    // Privates ---------------------------------------------------------------
    /** 
     * Collection JSON
     * @internal
     * */
    private buildJSON(): any {
        return {
            ...this.CPJSON(),
            ...this.include.map(key => [key, this[key as keyof this]]),
            data: this.map(entity => entity.toJSON()),
        }
    }

    // ------------------------------------------------------------------------

    /** 
     * Make computed properties JSON object
     * @internal 
     * */
    private CPJSON(): any {
        return Object.fromEntries(this.CPKeys.map(key => [key, this[key]]))
    }
}