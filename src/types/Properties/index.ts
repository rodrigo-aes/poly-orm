import type { Entity } from "../General"
import type { BaseEntity, Collection } from "../../Entities"
import type { RelationHandler } from "../../Relations"
import type { Primitive } from "../General"

// Metadata Types =============================================================
type prop = { __$prop?: true }
type autoGen = { __$autoGen?: true }

// Property Types =============================================================
export type Prop<T = any> = T & prop
export type AutoGenProp<T = any> = Prop<T> & autoGen
export type TK<T extends BaseEntity[]> = Prop<T[number]['__name']>

// Data Types =================================================================
export type EntityPropsKeys<T extends Entity> = {
    [K in keyof T]: (
        T[K] extends prop | null | undefined
        ? Extract<K, string>
        : never
    )
}[keyof T]

// ----------------------------------------------------------------------------

export type EntityProps<T extends Entity> = Pick<
    T,
    EntityPropsKeys<T>
>

// ----------------------------------------------------------------------------

export type RequiredProps<T> = (
    {
        [K in keyof T as (
            T[K] extends autoGen
            ? never
            : null extends T[K]
            ? never
            : undefined extends T[K]
            ? never
            : K
        )]: T[K]
    } &
    {
        [K in keyof T as (
            T[K] extends autoGen
            ? K
            : null extends T[K]
            ? K
            : undefined extends T[K]
            ? K
            : never
        )]?: T[K] | undefined
    }
)

// Relation Types =============================================================
export type EntityRelationsKeys<T extends Partial<Entity>> = {
    [K in keyof T]: (
        T[K] extends null
        ? never
        : T[K] extends RelationHandler<Entity>
        ? Extract<K, string>
        : never
    )
}[keyof T]

// ----------------------------------------------------------------------------

export type EntityRelations<T extends Partial<Entity>> = Pick<
    T,
    EntityRelationsKeys<T>
>

// Collection Types ===========================================================
export type CollectionPropsKeys<T extends Collection> = {
    [K in keyof T]: (
        T[K] extends prop
        ? Extract<K, string>
        : never
    )
}[keyof T]

// ----------------------------------------------------------------------------

export type CollectionProps<T extends Collection> = Pick<
    T,
    CollectionPropsKeys<T>
>