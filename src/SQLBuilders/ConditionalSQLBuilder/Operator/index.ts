import * as Symbols from './Symbols'
import * as Handlers from './Handlers'

import EqualOperator from "./Equal"
import NotEqualOperator from "./NotEqual"
import OrOperator from './Or'
import LowerThanOperator from "./LowerThan"
import LowerThanEqualOperator from "./LowerThanEqual"
import GreaterThanOpertor from "./GreaterThan"
import GreaterThanEqualOpertor from "./GreaterThanEqual"
import BetweenOperator from "./Between"
import NotBetweenOperator from "./NotBetween"
import InOperator from "./In"
import NotInOperator from "./NotIn"
import LikeOperator from "./Like"
import NotLikeOperator from "./NotLike"
import NullOperator from "./Null"
import NotNullOperator from "./NotNull"
import RegExpOperator from "./RegExp"
import NotRegExpOperator from "./NotRegExp"

// Types
import type {
    OperatorKey,
    OperatorType,
    CompatibleOperators,
} from './types'

export default abstract class Operator {
    public static [Symbols.Equal] = EqualOperator
    public static [Symbols.NotEqual] = NotEqualOperator
    public static [Symbols.Or] = OrOperator
    public static [Symbols.LT] = LowerThanOperator
    public static [Symbols.LTE] = LowerThanEqualOperator
    public static [Symbols.GT] = GreaterThanOpertor
    public static [Symbols.GTE] = GreaterThanEqualOpertor
    public static [Symbols.Between] = BetweenOperator
    public static [Symbols.NotBetween] = NotBetweenOperator
    public static [Symbols.In] = InOperator
    public static [Symbols.NotIn] = NotInOperator
    public static [Symbols.Like] = LikeOperator
    public static [Symbols.NotLike] = NotLikeOperator
    public static [Symbols.Null] = NullOperator
    public static [Symbols.NotNull] = NotNullOperator
    public static [Symbols.RegExp] = RegExpOperator
    public static [Symbols.NotRegExp] = NotRegExpOperator

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static isOperator(value: any): boolean {
        return Object
            .getOwnPropertySymbols(value)
            .some(key => this.isOperatorKey(key))

    }

    // ------------------------------------------------------------------------

    public static isOperatorKey(key: any): boolean {
        return Object.values(Symbols).includes(key as any)
    }
}

export const Op = {
    ...Symbols,
    ...Handlers,
    in: Handlers._in,
    null: Handlers._null,
}

export {
    type OperatorKey,
    type OperatorType,
    type CompatibleOperators,
}