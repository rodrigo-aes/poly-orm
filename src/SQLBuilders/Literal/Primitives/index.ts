export function Str(value: string): string {
    return `'${value}'`
}

// ----------------------------------------------------------------------------

export function Num(value: number | bigint): string {
    return value.toString()
}

// ----------------------------------------------------------------------------

export function Bool(value: boolean): string {
    return value ? 'TRUE' : 'FALSE'
}

// ----------------------------------------------------------------------------

export function Null(): string {
    return 'NULL'
}

// ----------------------------------------------------------------------------

export function Date(value: Date): string {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`
}

// ----------------------------------------------------------------------------

export function Json(value: object): string {
    return `'${JSON.stringify(value)}'`
}