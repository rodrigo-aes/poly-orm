import type { Constructor } from "../types"
import type { BaseEntity, Entity } from "../Entities"
import type { Old, New } from './Symbols'
import type {
    CreationAttributesOptions,
    UpdateAttributes,
    ConditionalQueryOptions
} from "../SQLBuilders"

export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF'
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE'
export type TriggerOrientation = 'ROW' | 'STATEMENT'

export type TriggerActionType = (
    'SET' |
    'INSERT INTO' |
    'UPDATE TABLE' |
    'DELETE FROM'
)

export type TriggerActionOptions<O extends (
    CreationAttributesOptions<any> |
    UpdateAttributes<any> |
    ConditionalQueryOptions<any>
)> = {
        [K in keyof O]: O[K] |
        { [Old]: string } |
        { [New]: string }
    }

export type SetAction<T extends BaseEntity> = {
    type: 'SET'
    attributes: TriggerActionOptions<
        UpdateAttributes<T>
    >
}

export type InsertIntoTableAction<T extends BaseEntity = BaseEntity> = {
    type: 'INSERT INTO'
    target: Constructor<T>,
    attributes: TriggerActionOptions<
        CreationAttributesOptions<T>
    >
}

export type UpdateTableAction<T extends BaseEntity = BaseEntity> = {
    type: 'UPDATE TABLE'
    target: Constructor<T>
    attributes: TriggerActionOptions<
        UpdateAttributes<T>
    >,
    where?: TriggerActionOptions<
        ConditionalQueryOptions<T>
    >
}

export type DeleteFromAction<T extends BaseEntity = BaseEntity> = {
    type: 'DELETE FROM'
    target: Constructor<T>
    where: TriggerActionOptions<
        ConditionalQueryOptions<T>
    >
}

export type TriggerAction<T extends BaseEntity> = (
    string |
    SetAction<T> |
    InsertIntoTableAction<BaseEntity> |
    UpdateTableAction<BaseEntity> |
    DeleteFromAction<BaseEntity>
)