import { Literal } from './Symbols'
import * as Operations from './Operations'
import * as General from './General'
import * as Primitives from "./Primitives"
import * as Operators from "./Operators"
import * as String from './String'
import * as Math from './Math'
import * as Date from './Date'
import * as Conditional from './Conditional'

const li = {
    ...General,
    ...Primitives,
    ...Operations,
    ...Operators,
    ...String,
    ...Math,
    ...Date,
    ...Conditional,

    delete: Operations._delete,
    in: Operators._in,
    null: Operators._null,
}

export type Literals = typeof li
export type LiteralHandler = (literals: Literals) => string

export default function literal(sql: string | LiteralHandler): {
    [Literal]: string
} {
    switch (typeof sql) {
        case 'string': return { [Literal]: sql }
        case 'function': return { [Literal]: sql(li) }

        default: throw new Error('Invalid literal')
    }
}

export {
    Literal,
    li
}