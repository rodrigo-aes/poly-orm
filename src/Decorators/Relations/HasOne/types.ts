import type {
    HasOneOptions as HasOneMetadataOptions
} from "../../../Metadata"

export type HasOneOptions = Omit<HasOneMetadataOptions, (
    'related' |
    'name'
)> | string
