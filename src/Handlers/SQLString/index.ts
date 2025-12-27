import { Literal, li } from "../../SQLBuilders"
import {
    Operator,
    type OperatorKey,
    type CompatibleOperators
} from "../../SQLBuilders"

// Symbols
import { Old, New } from "../../Triggers"

// Types
import type { Entity, Constructor } from "../../types"

// Exceptions
import PolyORMException from "../../Errors"

export default class SQLString {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static sanitize(sql: string): string {
        return sql.replace(/\s*\n\s*/g, ' ').trim()
    }

    // ------------------------------------------------------------------------

    public static pathToAlias(path: string, alias?: string): string {
        if (!path.includes('.')) return `${alias ? `${alias}.` : ''}${path}`

        const parts = path.split('.')
        const col = parts.pop()

        return `${alias ? `${alias}_` : ''}${parts.join('_')}.${col}`
    }

    // ------------------------------------------------------------------------

    public static cond<T extends Entity, V extends any>(
        target: Constructor<T>,
        col: string,
        value: V,
        alias?: string
    ): string {
        switch (true) {
            case typeof value === 'object': return this.objectCond(
                target,
                col,
                value,
                alias
            )

            // ----------------------------------------------------------------

            default: return `${this.pathToAlias(col, alias)} = ${(
                this.value(value)
            )}`
        }
    }

    // ------------------------------------------------------------------------

    public static value(value: any): string {
        switch (typeof value) {
            case "string": return li.Str(value)

            // ----------------------------------------------------------------

            case "number":
            case "bigint": return li.Num(value)

            // ----------------------------------------------------------------

            case "object": return this.objectValue(value)

            // ----------------------------------------------------------------

            case "boolean": return li.Bool(value)

            // ----------------------------------------------------------------

            case 'undefined': return li.Null()

            // ----------------------------------------------------------------

            case 'function': return this.value(value())

            // ----------------------------------------------------------------

            default: throw PolyORMException.MySQL.instantiate(
                'INCORRECT_VALUE',
                undefined,
                `column = ${value} (JS ${typeof value})`,
                'SQL',
                value
            )
        }
    }

    // Privates ---------------------------------------------------------------
    private static objectCond<T extends Entity>(
        target: Constructor<T>,
        col: string,
        value: any,
        alias?: string
    ): string {
        switch (true) {
            case value instanceof RegExp: return li.regExpLike(
                this.pathToAlias(col, alias),
                value
            )

            // ----------------------------------------------------------------

            case Operator.isOperator(value): return this.operatorValue(
                target,
                col,
                value as CompatibleOperators<any>,
                alias
            )

            // ----------------------------------------------------------------

            default: return `${this.pathToAlias(col, alias)} = ${(
                this.objectValue(value)
            )}`
        }
    }

    // ------------------------------------------------------------------------

    private static objectValue(value: any) {
        switch (true) {
            case value === null: return li.Null()

            // ------------------------------------------------------------

            case value instanceof Date: return li.Date(value)

            // ------------------------------------------------------------

            case this.hasSymbols(value): return this.symbolValue(
                value
            )

            // -----------------------------------------------------------

            default: return li.Json(value)
        }
    }

    // ------------------------------------------------------------------------

    private static symbolValue(value: any): any {
        const symbols = typeof value === 'symbol'
            ? [value]
            : Object.getOwnPropertySymbols(value)

        switch (true) {
            case this.symbolsAs(symbols, [Old, New]): return (
                value[Old] ?? value[New]
            )

            // ----------------------------------------------------------------

            case this.symbolsAs(symbols, [Literal]): return value[Literal]

            // ----------------------------------------------------------------

            default: throw new Error(`Unhandled symbol value(${(
                symbols.map(s => s.toString()).join(', ')
            )})`)
        }
    }

    // ------------------------------------------------------------------------

    private static operatorValue<T extends Entity>(
        target: Constructor<T>,
        col: string,
        operator: CompatibleOperators<any>,
        alias?: string
    ): string {
        const [key] = Object.getOwnPropertySymbols(operator) as (
            keyof CompatibleOperators<any>
        )[]

        return new Operator[key as OperatorKey](
            target,
            operator[key],
            col,
            alias
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private static hasSymbols(value: any): boolean {
        return (
            typeof value === 'symbol' ||
            Object.getOwnPropertySymbols(value).length > 0
        )
    }

    // ------------------------------------------------------------------------

    private static symbolsAs(symbols: Symbol[], as: Symbol[]): boolean {
        return symbols.some(symbol => as.includes(symbol))
    }
}