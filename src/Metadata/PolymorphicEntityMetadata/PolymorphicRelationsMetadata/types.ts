import type { EntityTarget, Target } from "../../../types"

export type IncludedCommonRelationOptions = {
    target: EntityTarget,
    relation: string
}

export type IncludedCommonRelations = {
    [Key: string]: IncludedCommonRelationOptions
}

export type IncludePolymorphicRelationOptions = {
    target: EntityTarget,
    relation: string
}[]

export type IncludedPolymorphicRelations = {
    [Key: string]: IncludePolymorphicRelationOptions | undefined
}