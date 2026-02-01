import type { Target } from "../../../types"

import type { FindQueryOptions } from "../../../SQLBuilders"
import type { MapOptions, CollectMapOptions } from "../../../Handlers"

export type ScopeOptions<T extends Target = Target> = [
    FindQueryOptions<InstanceType<T>>,
    MapOptions<any> | CollectMapOptions<InstanceType<T>>
]

export type ScopeFunction<T extends Target = Target> = (
    (...args: any[]) => FindQueryOptions<InstanceType<T>>
)

export type Scope<T extends Target = Target> = (
    FindQueryOptions<InstanceType<T>> |
    ScopeFunction<T>
)

export type ScopesMetadataJSON = {
    [Name: string]: FindQueryOptions<any> | undefined
}