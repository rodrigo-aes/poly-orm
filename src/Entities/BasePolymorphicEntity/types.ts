import type { EntityTarget, Constructor } from "../../types"

export type SourceEntity<T extends object[]> =
    Constructor<T[number]> extends infer U
    ? U extends EntityTarget
    ? InstanceType<U>
    : never
    : never
