import { PolymorphicEntityMetadata } from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"
// Decorators
import Column, { type IncludeColumnOptions } from "./Column"

import PolymorphicRelation, {
    type IncludePolymorphicRelationOptions
} from "./PolymorphicRelation"

import CommonRelation, {
    type IncludedCommonRelationOptions
} from "./CommonRelation"

// Types
import type {
    Constructor,
    EntityTarget,
    InstancesOf
} from "../../types"

import type { BaseEntity, BasePolymorphicEntity } from "../../Entities"

export default function PolymorphicEntity<
    S extends BaseEntity[],
    T extends BasePolymorphicEntity<S>
>(...entities: Constructor<S[number]>[]) {
    return function (
        target: Constructor<T>,
        context: ClassDecoratorContext<Constructor<T>>
    ) {
        PolymorphicEntityMetadata.findOrBuild(
            target,
            target.name.toLowerCase(),
            entities
        )
        DecoratorMetadata.define(context.metadata).register(target)
    }
}

export {
    Column,
    PolymorphicRelation,
    CommonRelation,

    type IncludeColumnOptions,
    type IncludePolymorphicRelationOptions,
    type IncludedCommonRelationOptions,
}