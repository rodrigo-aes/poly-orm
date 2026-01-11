import MetadataArray from "../../../../MetadataArray"
import EntityMetadata from "../../.."

// Types
import type { EntityTarget } from "../../../../../types"

export default class CheckConstraint extends MetadataArray<string> {
    constructor(
        public target: EntityTarget,
        public columnName: string,
        ...constraints: string[]
    ) {
        super(target, ...constraints)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.target)
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return `chk_${this.tableName}_${this.columnName}`
    }
}