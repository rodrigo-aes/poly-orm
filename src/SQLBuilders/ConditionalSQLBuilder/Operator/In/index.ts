import Operator from "../Operator"
import { In } from "../Symbols"

// Hepers
import { SQLString } from "../../../../Handlers"

export default class InOperator extends Operator<typeof In> {
    protected readonly operatorSQL: string = 'IN'

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