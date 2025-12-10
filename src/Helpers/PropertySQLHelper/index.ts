import { MetadataHandler } from "../../Metadata"

// Symbols
import { Literal } from "../../SQLBuilders"
import { Old, New } from "../../Triggers"

// Types
import type { Target } from "../.."

// Exceptions
import PolyORMException from "../../Errors"

export default class PropertySQLHelper {
    public static pathToAlias(path: string, alias?: string): string {
        if (!path.includes('.')) return `${alias ? `${alias}.` : ''}${path}`

        const parts = path.split('.')
        const column = parts.pop()

        return `${alias ? `${alias}_` : ''}${parts.join('_')}.${column}`
    }

    // ------------------------------------------------------------------------

    public static valueSQL(value: any, target?: Target): string {
        switch (typeof value) {
            case "string": return `'${value}'`

            // ----------------------------------------------------------------

            case "object": switch (true) {
                case value === null: return 'NULL'
                case value instanceof Date: return `'${(
                    value.toISOString().slice(0, 19).replace('T', ' ')
                )}'`
                case this.hasSymbols(value): return this.handleSymbolValue(
                    value, target
                )

                default: return `'${JSON.stringify(value)}'`
            }

            // ----------------------------------------------------------------

            case "number":
            case "bigint": return value.toString()

            // ----------------------------------------------------------------

            case "boolean": return value ? 'TRUE' : 'FALSE'

            // ----------------------------------------------------------------

            case 'function': return this.valueSQL(value())

            // ----------------------------------------------------------------

            case 'undefined': return 'NULL'

            // ----------------------------------------------------------------

            default:
                throw PolyORMException.MySQL.instantiate(
                    'INCORRECT_VALUE',
                    undefined,
                    `column = ${value} (JS ${typeof value})`,
                    'SQL',
                    value
                )
        }
    }

    // ------------------------------------------------------------------------

    private static hasSymbols(value: any, target?: Target): boolean {
        return (
            typeof value === 'symbol' ||
            Object.getOwnPropertySymbols(value).length > 0
        )
    }

    // ------------------------------------------------------------------------

    private static symbolsAs(symbols: Symbol[], as: Symbol[]): boolean {
        return symbols.some(symbol => as.includes(symbol))
    }

    // ------------------------------------------------------------------------

    private static handleSymbolValue(value: any, target?: Target): any {
        const symbols = typeof value === 'symbol'
            ? [value]
            : Object.getOwnPropertySymbols(value)

        switch (true) {
            case this.symbolsAs(symbols, [Old, New]): return (
                value[Old] ?? value[New]
            )

            // ----------------------------------------------------------------

            case this.symbolsAs(symbols, [Literal]): return value[Literal]

            default: throw new Error
        }
    }
}