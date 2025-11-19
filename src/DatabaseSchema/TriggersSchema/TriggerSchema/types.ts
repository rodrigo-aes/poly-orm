import type { BaseEntity } from "../../../Entities"
import type TriggerSchema from "."
import type {
    TriggerEvent,
    TriggerTiming,
    TriggerOrientation,
    TriggerAction
} from "../../../Triggers"

export type TriggerSchemaInitMap = {
    tableName: string
    name: string
    event?: TriggerEvent
    timing?: TriggerTiming
    orientation?: TriggerOrientation
    action?: string
}

export type TriggerActionHandler<T extends BaseEntity = BaseEntity> = (
    (schema: TriggerSchema) => string | TriggerAction<T>[]
)

export type AlreadyDefinedEvent<T extends TriggerSchema> = Omit<T, (
    'before' |
    'after' |
    'insteadOf'
)>