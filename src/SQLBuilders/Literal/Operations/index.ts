import { table as _table, col as _col, val as _value } from "../General"

export function select(
    from: string | string[],
    cols: string[],
    ...query: string[]
): string {
    return `SELECT ${cols.map(c => _col(c)).join(', ')} FROM ${(
        _table(from)
    )} ${query.join(' ')}`
}

// ----------------------------------------------------------------------------

export function insert(
    into: string,
    cols: string[],
    values: string[] | string[][]
): string {
    return `INSERT INTO ${_table(into)} (${(
        cols.map(c => _col(c)).join(', ')
    )}) VALUES ${(() => {
        return Array.isArray(values[0])
            ? (values as string[][])
                .map(v => `(${v.map(v => _value(v)).join(', ')})`)
                .join(', ')
            : `(${(values as string[]).map(v => _value(v)).join(', ')})`
    })()}`
}

// ----------------------------------------------------------------------------

export function update(
    table: string,
    set: string | string[] | { [Col: string]: string },
    ...query: string[]
): string {
    return `UPDATE ${_table(table)} SET ${(() => {
        switch (typeof set) {
            case 'string': return set
            case 'object': return Array.isArray(set)
                ? set.join(', ')
                : Object.entries(set)
                    .map(([col, value]) => `${_col(col)} = ${_value(value)}`)
                    .join(', ')
        }
    })()} ${query.join(' ')}`
}

// ----------------------------------------------------------------------------

export function set(col: string, value: string): string {
    return `${_col(col)} = ${_value(value)}`
}

// ----------------------------------------------------------------------------

export function _delete(from: string, ...query: string[]): string {
    return `DELETE FROM ${_table(from)} ${query.join(' ')}`
}

// ----------------------------------------------------------------------------

export function leftJoin(table: string | string[], on: string): string {
    return `LEFT JOIN ${_table(table)} ON ${on}`
}

// ----------------------------------------------------------------------------

export function innerJoin(table: string | string[], on: string): string {
    return `INNER JOIN ${_table(table)} ON ${on}`
}

// ----------------------------------------------------------------------------

export function crossJoin(table: string | string[]): string {
    return `CROSS JOIN ${_table(table)}`
}

// ----------------------------------------------------------------------------

export function orderBy(...orders: (
    string |
    [string, 'ASC' | 'DESC' | undefined]
)[]): string {
    return orders
        .map(order => {
            switch (typeof order) {
                case 'string': return order
                case 'object': return `${_col(order[0])} ${order[1] || 'ASC'}`
            }
        })
        .join(', ')
}