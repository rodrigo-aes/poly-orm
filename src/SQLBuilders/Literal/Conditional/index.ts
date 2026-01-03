import If from "./If"
import Case from "./Case"

function _cond(conditional: string | string[]) {
    return Array.isArray(conditional)
        ? or(conditional)
        : conditional
}

function where(conditional: string | string[]) {
    return 'WHERE ' + _cond(conditional)
}

// ----------------------------------------------------------------------------

function on(conditional: string | string[]) {
    return 'ON ' + _cond(conditional)
}

// ----------------------------------------------------------------------------

function and(conditional: string[]) {
    return conditional.join(' AND ')
}

// ----------------------------------------------------------------------------

function or(conditional: string[]) {
    return conditional.map(c => `(${c})`).join(' OR ')
}

// ----------------------------------------------------------------------------

function ternary(condition: string, then: string, _else: string): string {
    return `IF(${condition}, ${then}, ${_else})`
}

// ----------------------------------------------------------------------------

function coalesce(...args: string[]): string {
    return `COALESCE(${args.join(', ')})`
}

// ----------------------------------------------------------------------------

function nullIf(a: string, b: string): string {
    return `NULLIF(${a}, ${b})`
}

// ----------------------------------------------------------------------------

export default {
    where,
    on,
    and,
    or,
    If,
    Case,
    coalesce,
    ternary,
    nullIf
}