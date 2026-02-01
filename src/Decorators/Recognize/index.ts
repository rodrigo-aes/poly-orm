import DecoratorMetadata from "../DecoratorMetadata"
import type { Recognizable } from "./types"

export default function Recognize(
    target: Recognizable,
    context: ClassDecoratorContext<Recognizable>
) {
    DecoratorMetadata.define(context.metadata).register(target)
}

export type {
    Recognizable
}