import type { Entity } from "../../../types"
import type { Collection, Pagination } from "../../../Entities"

export type ComputedPropertyFunction<
    T extends Entity | Collection<any> | Pagination<any> = any
> = (instance: T) => any | Promise<any>

export type ComputedPropertiesJSON = {
    [Prop: string]: ComputedPropertyFunction
}