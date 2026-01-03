// Types
import type { Primitive } from "../../../types"

export function equal(a: string, b: string) {
    return `${a} = ${b}`
}

// ----------------------------------------------------------------------------

export function notEqual(a: string, b: string) {
    return `${a} != ${b}`
}

// ----------------------------------------------------------------------------

export function lt(a: string, b: string) {
    return `${a} < ${b}`
}

// ----------------------------------------------------------------------------

export function lte(a: string, b: string) {
    return `${a} <= ${b}`
}

// ----------------------------------------------------------------------------

export function gt(a: string, b: string) {
    return `${a} > ${b}`
}

// ----------------------------------------------------------------------------

export function gte(a: string, b: string) {
    return `${a} >= ${b}`
}

// ----------------------------------------------------------------------------

export function between(value: string, init: string, end: string) {
    return `${value} BETWEEN ${init} AND ${end}`
}

// ----------------------------------------------------------------------------

export function notBetween(value: string, init: string, end: string) {
    return `${value} NOT BETWEEN ${init} AND ${end}`
}

// ----------------------------------------------------------------------------

export function _in(value: string, ...values: Primitive[]) {
    return `${value} IN (${values.join(", ")})`
}

// ----------------------------------------------------------------------------

export function notIn(value: string, ...values: Primitive[]) {
    return `${value} NOT IN (${values.join(", ")})`
}

// ----------------------------------------------------------------------------

export function like(value: string) {
    return `${value} LIKE ${value}`
}

// ----------------------------------------------------------------------------

export function notLike(value: string) {
    return `${value} NOT LIKE ${value}`
}

// ----------------------------------------------------------------------------

export function _null(value: string) {
    return `${value} IS NULL`
}

// ----------------------------------------------------------------------------

export function notNull(value: string) {
    return `${value} IS NOT NULL`
}

// ----------------------------------------------------------------------------

export function regExp(value: string, regex: string) {
    return `${value} REGEXP ${regex}`
}

// ----------------------------------------------------------------------------

export function notRegExp(value: string, regex: string) {
    return `${value} NOT REGEXP ${regex}`
}