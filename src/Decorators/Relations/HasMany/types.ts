import type {
    HasManyOptions as HasManyMetadataOptions
} from "../../../Metadata"

export type HasManyOptions = Omit<HasManyMetadataOptions, (
    'related' |
    'name'
)>