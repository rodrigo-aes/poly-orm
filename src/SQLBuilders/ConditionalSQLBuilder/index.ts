import WhereSQLBuilder from "./WhereSQLBuilder"
import OnSQLBuilder from "./OnSQLBuilder"
import Operator, {
    Op,
    type OperatorKey,
    type CompatibleOperators
} from "./Operator"
import CaseSQLBuilder, {
    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
} from "./CaseSQLBuilder"

import {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type EntityExistsQueryOption
} from "./ExistsSQLBuilder"

// Types
import type { Entity, Constructor, Target } from "../../types"
import type {
    ConditionalQueryOptions,
    AndQueryOptions,
    OrQueryOptions
} from "./types"

import type { RelationMetadataType } from "../../Metadata"

// Exceptions
import PolyORMException from "../../Errors"

export default class ConditionalSQLBuilder {
    private constructor() {
        PolyORMException.Common.throw(
            'NOT_INSTANTIABLE_CLASS', this.constructor.name
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static where<T extends Entity>(
        target: Constructor<T>,
        options: ConditionalQueryOptions<T>,
        alias?: string,
    ): WhereSQLBuilder<T> {
        return new WhereSQLBuilder(target, options, alias)
    }

    // ------------------------------------------------------------------------

    public static on<P extends Entity, T extends Entity>(
        parent: Constructor<P>,
        target: Constructor<T>,
        relation: RelationMetadataType,
        options?: ConditionalQueryOptions<T>,
        parentAlias?: string,
        alias?: string,
    ): OnSQLBuilder<P, T> {
        return new OnSQLBuilder(
            parent,
            target,
            relation,
            options,
            parentAlias,
            alias,
        )
    }

    // ------------------------------------------------------------------------

    public static case<T extends Entity>(
        target: Constructor<T>,
        options: CaseQueryOptions<T>,
        as?: string,
        alias?: string
    ): CaseSQLBuilder<T> {
        return new CaseSQLBuilder(
            target,
            options,
            as,
            alias
        )
    }
}

export {
    WhereSQLBuilder,
    OnSQLBuilder,
    CaseSQLBuilder,
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,

    Operator,
    Op,
    type OperatorKey,
    type CompatibleOperators,

    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,

    Exists,
    Cross,
    type ExistsQueryOptions,
    type EntityExistsQueryOption
}