import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity, Constructor } from "../../../../types"
import type {
    CountSQLBuilder,
    CountQueryOption,
    CountQueryOptions
} from "../../../../SQLBuilders"
import type { CountManyResult } from "./types"

// Exceptions
import PolyORMException from "../../../../Errors"

export default class CountOperation<
    T extends Entity,
    O extends CountQueryOption<T> | CountQueryOptions<T>
> extends OperationHandler<T, CountSQLBuilder<T>, never> {
    public readonly fillMethod = 'One'

    public exec(): Promise<any> {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD',
            'exec',
            this.constructor.name,
        )
    }

    // ------------------------------------------------------------------------

    public async execSingle(): Promise<(
        O extends CountQueryOption<T>
        ? number
        : never
    )> {
        return (await this.execQuery())[0].result
    }

    // ------------------------------------------------------------------------

    public async execMany(): Promise<(
        O extends CountQueryOptions<T>
        ? CountManyResult<T, O>
        : never
    )> {
        return (await this.execQuery())[0]
    }
}

export type {
    CountManyResult
}
