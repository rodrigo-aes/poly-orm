import * as Op from "../Symbols"

// Types
import type { Primitive } from "../../../../types"

export function notEqual(value: Primitive) {
    return { [Op.NotEqual]: value }
}

// ----------------------------------------------------------------------------

export function lt(value: number | Date) {
    return { [Op.LT]: value }
}

// ----------------------------------------------------------------------------

export function lte(value: number | Date) {
    return { [Op.LTE]: value }
}

// ----------------------------------------------------------------------------

export function gt(value: number | Date) {
    return { [Op.GT]: value }
}

// ----------------------------------------------------------------------------

export function gte(value: number | Date) {
    return { [Op.GTE]: value }
}

// ----------------------------------------------------------------------------

export function between(init: number | Date, end: number | Date) {
    return { [Op.Between]: [init, end] }
}

// ----------------------------------------------------------------------------

export function notBetween(init: number | Date, end: number | Date) {
    return { [Op.NotBetween]: [init, end] }
}

// ----------------------------------------------------------------------------

export function _in(...values: Primitive[]) {
    return { [Op.In]: values }
}

// ----------------------------------------------------------------------------

export function notIn(...values: Primitive[]) {
    return { [Op.NotIn]: values }
}

// ----------------------------------------------------------------------------

export function like(value: string) {
    return { [Op.Like]: value }
}

// ----------------------------------------------------------------------------

export function notLike(value: string) {
    return { [Op.NotLike]: value }
}

// ----------------------------------------------------------------------------

export function _null(): { [Op.Null]: true } {
    return { [Op.Null]: true }
}

// ----------------------------------------------------------------------------

export function notNull(): { [Op.NotNull]: true } {
    return { [Op.NotNull]: true }
}

// ----------------------------------------------------------------------------

export function regExp(value: RegExp | string) {
    return { [Op.RegExp]: value }
}

// ----------------------------------------------------------------------------

export function notRegExp(value: RegExp | string) {
    return { [Op.NotRegExp]: value }
}

// export function any(values: Primitive[] | string) {
//     return { [Op.Any]: values }
// }

// export function all(values: Primitive[] | string) {
//     return { [Op.All]: values }
// }