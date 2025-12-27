import If from "./If"
import Case from "./Case"

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
    If,
    Case,
    coalesce,
    ternary,
    nullIf
}