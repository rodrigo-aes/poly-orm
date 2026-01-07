import { MetadataHandler } from "../../Metadata"

// SQL Builders
import {
    Case,

    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type CountQueryOptions
} from "../../SQLBuilders"

// Query Handlers
import CaseQueryBuilder from "../CaseQueryBuilder"
import CountQueryBuilder from "../CountQueryBuilder"

// Types
import type { Constructor, Entity, TargetMetadata } from "../../types"
import type { CountQueryHandler, CaseQueryHandler } from "../types"
import type { SelectPropertyType, SelectPropertiesOptions } from "./types"

/**
 * Build `SELECT` options
 */
export default class SelectQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private props: SelectPropertyType<T>[] = []

    /** @internal */
    private counts: CountQueryBuilder<T>[] = []

    /** @internal */
    constructor(
        /** @internal */
        public target: Constructor<T>,

        /** @internal */
        public alias?: string
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define entity properties to select
     * @param properties - Properties names 
     * @returns {this} - `this`
     */
    public properties(...properties: SelectPropertiesOptions<T>[]): this {
        this.props = [
            ...this.props,
            ...properties.map(prop => this.handleProperty(prop))
        ]
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define to select a inline `COUNT` with entity properties
     * @param option - Entity property name to count or count query handler
     * @param as - Alias/Name to count result
     * @returns {this} - `this`
     */
    public count(option: CountQueryHandler<T> | string, as?: string): this {
        const handler = new CountQueryBuilder(this.target, this.alias)[
            (() => {
                switch (typeof option) {
                    case "string": return 'property'
                    case "function": return 'handle'
                }
            })()
        ](option as any)

        if (as) handler.as(as)
        this.counts.push(handler as any)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `SelectOptions` object
    * @returns - A object with select options
    */
    public toQueryOptions(): SelectOptions<T> {
        return {
            properties: this.propertiesToOptions(),
            count: this.countToOptions()
        }
    }

    // Privates ---------------------------------------------------------------
    /** @interal */
    private propertiesToOptions(): SelectPropertyOptions<T>[] {
        return this.props.map(prop => {
            switch (typeof prop) {
                case "string": return prop as SelectPropertyKey<T>

                // ------------------------------------------------------------
                case "object": return {
                    [Case]: prop.toQueryOptions(),
                    as: prop._as!
                }

                // ------------------------------------------------------------

                default: throw new Error('Unreacheable Error')
            }
        })
    }

    // ------------------------------------------------------------------------

    /** @interal */
    private countToOptions(): CountQueryOptions<T> {
        return Object.fromEntries(this.counts.map(count => [
            count._as!, count.toQueryOptions()
        ]))
    }

    // ------------------------------------------------------------------------

    /** @interal */
    private handleProperty(option: (
        SelectPropertyKey<T> |
        CaseQueryHandler<T>
    )): SelectPropertyKey<T> | CaseQueryBuilder<T> {
        switch (typeof option) {
            case "string": return option
            case "function": return new CaseQueryBuilder(
                this.target,
                this.alias
            )
                .handle(option)

            default: throw new Error('Unreacheable Error')
        }
    }
}


export {
    type SelectPropertiesOptions
}