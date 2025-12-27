// SQL Builders
import * as Op from "../../SQLBuilders/ConditionalSQLBuilder/Operator/Symbols"

// Types
import type { OperatorType, CompatibleOperators } from "./types"

/** @internal */
export default class OperatorQueryBuilder {
    public static '=' = Op.Equal
    public static '!=' = Op.NotEqual
    public static '<' = Op.LT
    public static '<=' = Op.LTE
    public static '>' = Op.GT
    public static '>=' = Op.GTE
    public static 'BETWEEN' = Op.Between
    public static 'NOT BETWEEN' = Op.NotBetween
    public static 'IN' = Op.In
    public static 'NOT IN' = Op.NotIn
    public static 'LIKE' = Op.Like
    public static 'NOT LIKE' = Op.NotLike
    public static 'IS NULL' = Op.Null
    public static 'IS NOT NULL' = Op.NotNull
    public static 'REGEXP' = Op.RegExp
    public static 'NOT REGEXP' = Op.NotRegExp

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static isOperator(key: string): boolean {
        return Object.keys(this).includes(key)
    }
}

export {
    type OperatorType,
    type CompatibleOperators
}