import { SQLString } from "../../../Handlers"

export function table(name: string): string {
    return `\´${name}\´`
}

export function col(name: string): string {
    return `\´${name}\´`
}

export function value(value: any): string {
    return SQLString.value(value)
}