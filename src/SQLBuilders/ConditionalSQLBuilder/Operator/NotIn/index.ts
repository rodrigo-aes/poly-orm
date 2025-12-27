import Operator from "../Operator"
import { NotIn } from "../Symbols"

// Helpers
import { SQLString } from "../../../../Handlers"

export default class NotInOperator extends Operator<typeof NotIn> {
    protected readonly operatorSQL: string = 'NOT IN'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return `(${(
            this.value
                .map(val => SQLString.value(val))
                .join(', ')
        )})`
    }
}