import type {
    BelongsToOptions as BelongsToMetadataOptions
} from "../../../Metadata"

export type BelongToOptions = Omit<BelongsToMetadataOptions, (
    'name' |
    'related'
)>