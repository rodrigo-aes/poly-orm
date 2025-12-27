import RegExpLike from "./RegExpLike"

export function concat(...values: string[]): string {
    return `CONCAT(${values.join(', ')})`
}

// ----------------------------------------------------------------------------

export function concat_ws(separator: string, ...values: string[]): string {
    return `CONCAT_WS(${separator}, ${values.join(', ')})`
}

// ----------------------------------------------------------------------------

export function length(value: string): string {
    return `LENGTH(${value})`
}

// ----------------------------------------------------------------------------

export function charLength(value: string): string {
    return `CHAR_LENGTH(${value})`
}

// ----------------------------------------------------------------------------

export function lower(value: string): string {
    return `LOWER(${value})`
}

// ----------------------------------------------------------------------------

export function upper(value: string): string {
    return `UPPER(${value})`
}

// ----------------------------------------------------------------------------

export function trim(value: string): string {
    return `TRIM(${value})`
}

// ----------------------------------------------------------------------------

export function ltrim(value: string): string {
    return `LTRIM(${value})`
}

// ----------------------------------------------------------------------------

export function rtrim(value: string): string {
    return `RTRIM(${value})`
}

// ----------------------------------------------------------------------------

export function substring(value: string, start: number, length: number): string {
    return `SUBSTRING(${value}, ${start}, ${length})`
}

// ----------------------------------------------------------------------------

export function replace(value: string, search: string, replace: string): string {
    return `REPLACE(${value}, ${search}, ${replace})`
}

// ----------------------------------------------------------------------------

export function left(value: string, length: number): string {
    return `LEFT(${value}, ${length})`
}

// ----------------------------------------------------------------------------

export function right(value: string, length: number): string {
    return `RIGHT(${value}, ${length})`
}

// ----------------------------------------------------------------------------

export function repeat(value: string, count: number): string {
    return `REPEAT(${value}, ${count})`
}

// ----------------------------------------------------------------------------

export function reverse(value: string): string {
    return `REVERSE(${value})`
}

// ----------------------------------------------------------------------------

export function regExpLike(value: string, regex: RegExp): string {
    return RegExpLike.regExpLike(value, regex)
}