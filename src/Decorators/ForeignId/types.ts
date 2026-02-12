import type { EntityTarget } from "../../types"
import type { ForeignIdConfig } from "../../Metadata"

export type ForeignIdRelatedGetter = () => Object
export type ForeignIdOptions = Omit<ForeignIdConfig, 'referenced'>