import { SQLString as SQLStringHandler } from "../../../Handlers"

class SQLString extends String { }

// ----------------------------------------------------------------------------

export function table<T extends string | String>(name: T | T[]): SQLString {
    return Array.isArray(name)
        ? new SQLString(name.map(n => `\`${n}\``).join(' '))
        : name instanceof SQLString
            ? name
            : new SQLString(`\`${name}\``)
}

// ----------------------------------------------------------------------------

export function col<T extends string | String>(name: T): SQLString {
    return name instanceof SQLString
        ? name
        : new SQLString(`\`${name}\``)
}

// ----------------------------------------------------------------------------

export function val<T extends string | String>(value: T): SQLString {
    return value instanceof SQLString
        ? value
        : new SQLString(SQLStringHandler.value(value))
}