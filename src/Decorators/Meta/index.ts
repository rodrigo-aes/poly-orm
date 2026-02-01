import DecoratorMetadata from "../DecoratorMetadata"
import type { MetaTarget } from "./types"

export default function Meta(
    target: MetaTarget,
    context: ClassDecoratorContext<MetaTarget>
) {
    DecoratorMetadata.define(context.metadata).register(target)
}

export type {
    MetaTarget
}