// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types"

import type { ColumnMetadata, ColumnPattern } from "../../../EntityMetadata"
import type { PolymorphicColumnMetadataJSON } from "./types"

export default class PolymorphicColumnMetadata {
    public primary?: boolean
    public isForeignKey?: boolean
    public pattern?: ColumnPattern

    private static readonly commonPropsKeys: (keyof ColumnMetadata)[] = [
        'primary',
        'isForeignKey',
        'pattern',
    ]

    constructor(
        public target: PolymorphicEntityTarget,
        public name: string,
        public sources?: ColumnMetadata[]
    ) {
        if (sources) Object.assign(this, this.getCommonProps())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public targetSource(target: EntityTarget): ColumnMetadata | undefined {
        return this.sources?.find(source =>
            target.prototype instanceof source.target ||
            target === source.target
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): PolymorphicColumnMetadataJSON {
        return {
            name: this.name,
            primary: this.primary,
            isForeignKey: this.isForeignKey,
            pattern: this.pattern,
        }
    }

    // Private ----------------------------------------------------------------
    private getCommonProps(): any {
        return Object.fromEntries(
            PolymorphicColumnMetadata.commonPropsKeys.flatMap(key => {
                const [first] = this.sources!

                return this.sources!.every(
                    source => source[key] === first[key]
                )
                    ? [[key, first[key]]]
                    : []
            })
        )
    }
}

export {
    type PolymorphicColumnMetadataJSON
}