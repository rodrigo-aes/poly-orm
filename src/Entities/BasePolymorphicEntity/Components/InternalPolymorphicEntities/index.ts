import type { PolymorphicEntityTarget } from "../../../../types";

class InternalPolymorphicEntities extends Map<
    string,
    PolymorphicEntityTarget
> { }

export default new InternalPolymorphicEntities