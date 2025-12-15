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

    constructor(...entities: T[]) {
        super(...entities)
        this.assignComputedProperties()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get shouldUpdate(): boolean {
        return true
    }

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

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Make as JSON object of collection and entities properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON(this: Collection<T>) {
        return this.hasComputedProperties()
            ? this.hide({
                ...this.computedPropertiesJSON(),
                data: this.map((entity: any) => entity.toJSON())
            })

            : Array.from(this.map((entity: any) => entity.toJSON()))
    }

    // ------------------------------------------------------------------------

    /**
    * Hidde collection and entity hidden properties
    * @param json - Optional data to make hidden
    * @returns A object without hidden properties
    */
    public hide(json?: any) {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    /**
     * Fill entities properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill(data: Partial<EntityProperties<T>>): this {
        for (const entity of this) (entity as any).fill(data)
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
        filter?: (value: T, index: number, array: T[]) => boolean
    ): Promise<T[]> {
        const entities = filter ? this.filter(filter) : this

        for (const entity of entities) await (entity as any).update(
            attributes
        )

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of each entoity instance matched by filter fn
     */
    public async delete(filter: (value: T, index: number, array: T[]) => (
        boolean
    )): Promise<this> {
        for (const entity of this.filter(filter)) await (
            this.splice(this.indexOf(entity), 1)[0] as any
        )
            .delete()

        return this
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected getComputedPropertiesMetadata(): (
        ComputedPropertiesMetadata | undefined
    ) {
        return ComputedPropertiesMetadata.find(
            this.constructor as CollectionTarget
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected assignComputedProperties(): void {
        this.getComputedPropertiesMetadata()?.assign(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected hasComputedProperties(): boolean {
        return !!this.getComputedPropertiesMetadata()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected computedPropertiesKeys(): string[] {
        return Array
            .from(this.getComputedPropertiesMetadata()?.keys() ?? []) as (
                string[]
            )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected computedPropertiesJSON(): any {
        return Object.fromEntries(
            Object.entries(this)
                .filter(([key]) => this.computedPropertiesKeys().includes(key))
        )
    }
}