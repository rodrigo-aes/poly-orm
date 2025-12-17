import MetadataMap from "../../MetadataMap"
import {
    Entity as EntityBase,
    Collection,
    Pagination
} from "../../../Entities"

// Types
import type { Entity, Constructor } from "../../../types"

import type { ComputedPropertyFunction, ComputedPropertiesJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class ComputedPropertiesMetadata<
    T extends Entity | Collection<any> | Pagination<any> = any
> extends MetadataMap<
    string, ComputedPropertyFunction<T>
> {
    constructor(public target: Constructor<T>) {
        super(target)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_CONNECTION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'computed-props-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async assign(target: T): Promise<void> {
        for (const [prop, fn] of Array.from(this.entries())) (
            target[prop as keyof T] = await fn(target)
        )
    }
}

export {
    type ComputedPropertyFunction,
    type ComputedPropertiesJSON
}