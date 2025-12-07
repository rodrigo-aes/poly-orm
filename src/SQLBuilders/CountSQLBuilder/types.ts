import type { Entity } from "../../types"
import type { CountQueryOption } from "./CountSQL"

export type CountQueryOptions<T extends Entity> = {
    [k: string]: CountQueryOption<T>
}