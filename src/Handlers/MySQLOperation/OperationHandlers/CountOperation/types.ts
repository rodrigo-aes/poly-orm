import type { Entity } from "../../../../types"
import type { CountQueryOptions } from "../../../../SQLBuilders"

export type CountManyResult<
    T extends Entity,
    O extends CountQueryOptions<T>
> = { [K in keyof O]: number }
