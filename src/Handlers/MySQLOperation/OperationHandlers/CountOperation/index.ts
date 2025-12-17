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

export default class CountOperation extends OperationHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static exec(): Promise<any> {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'exec', this.name
        )
    }

    // ------------------------------------------------------------------------

    public static async execSingle<
        T extends Entity,
        B extends CountSQLBuilder<T>
    >(target: Constructor<T>, sqlBuilder: B): Promise<number> {
        return (await this.execQuery(target, sqlBuilder))[0].result
    }

    // ------------------------------------------------------------------------

    public static async execMany<
        T extends Entity,
        B extends CountSQLBuilder<T>,
        O extends CountQueryOptions<T>
    >(target: Constructor<T>, sqlBuilder: B): Promise<(
        O extends CountQueryOptions<T>
        ? CountManyResult<T, O>
        : never
    )> {
        return (await this.execQuery(target, sqlBuilder))[0]
    }
}

export type {
    CountManyResult
}
