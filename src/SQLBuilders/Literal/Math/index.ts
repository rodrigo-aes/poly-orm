export function add(a: number, b: number): string {
    return `(${a} + ${b})`
}

// ----------------------------------------------------------------------------

export function subtract(a: number, b: number): string {
    return `(${a} - ${b})`
}

// ----------------------------------------------------------------------------

export function multiply(a: number, b: number): string {
    return `(${a} * ${b})`
}

// ----------------------------------------------------------------------------

export function divide(a: number, b: number): string {
    return `(${a} / ${b})`
}

// ----------------------------------------------------------------------------

export function mod(a: number, b: number): string {
    return `(${a} % ${b})`
}

// ----------------------------------------------------------------------------

export function power(a: number, b: number): string {
    return `(${a} ^ ${b})`
}

// ----------------------------------------------------------------------------

export function abs(a: number | string): string {
    return `ABS(${a})`
}

// ----------------------------------------------------------------------------

export function round(a: number | string, b: number | string): string {
    return `ROUND(${a}, ${b})`
}

// ----------------------------------------------------------------------------

export function ceil(a: number | string): string {
    return `CEIL(${a})`
}

// ----------------------------------------------------------------------------

export function floor(a: number | string): string {
    return `FLOOR(${a})`
}

// ----------------------------------------------------------------------------

export function sign(a: number | string): string {
    return `SIGN(${a})`
}

// ----------------------------------------------------------------------------

export function random(): string {
    return `RAND()`
}

// ----------------------------------------------------------------------------

export function count(a: number | string): string {
    return `COUNT(${a})`
}
