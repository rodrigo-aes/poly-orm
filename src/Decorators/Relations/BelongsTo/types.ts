import type {
    BelongsToOptions as BelongsToMetadataOptions
} from "../../../Metadata"

export type BelongsToOptions = Omit<BelongsToMetadataOptions, (
    'name' |
    'related'
)>