import DecoratorMeta from "../DecoratorMetadata"
import type { Recognizable } from "./types"

export default function Recognize(
    target: Recognizable,
    context: ClassDecoratorContext<Recognizable>
) {
    DecoratorMeta.define(context.metadata).register(target)
}

export type {
    Recognizable
}