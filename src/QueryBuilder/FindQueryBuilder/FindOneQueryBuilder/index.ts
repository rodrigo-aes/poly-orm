import FindQueryBuilder from "../FindQueryBuilder"
import { MetadataHandler } from "../../../Metadata"

// SQL Builders
import {
    FindOneSQLBuilder,

    type FindOneQueryOptions as SQLBuilderOptions,
    type RelationsOptions,
    type GroupQueryOptions,

} from "../../../SQLBuilders"

// Query Builders
import SelectQueryBuilder from "../../SelectQueryBuilder"
import ConditionalQueryBuilder from "../../ConditionalQueryBuilder"
import JoinQueryBuilder from "../../JoinQueryBuilder"
import GroupQueryBuilder from "../../GroupQueryBuilder"

// Handlers
import {
    MySQLOperation,
    type FindOneResult,
    type FindResult,
    type MapOptions,
    type CollectMapOptions
} from "../../../Handlers"

// Types
import type {
    Entity,
    Target,
    TargetMetadata,
    EntityTarget,
    EntityProperties,
    EntityPropertiesKeys,
    Constructor,
} from "../../../types"

import type { FindOneQueryOptions } from "./types"

import type {
    SelectQueryHandler,
    CountQueryHandler,
    JoinQueryHandler
} from "../../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../../OperatorQueryBuilder"

import type { SelectPropertiesOptions } from "../../SelectQueryBuilder"
import type { ExistsQueryOptions } from "../../ExistsQueryBuilder"
import type { ConditionalQueryHandler } from "../../types"

// Exceptions
import PolyORMException from "../../../Errors"

/**
 * Build FindOne query
 */
export default class FindOneQueryBuilder<
    T extends Entity
> extends FindQueryBuilder<T> {
    /**
     * Excute operation in database and returns Find one result
     * @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance or `null`
     */
    public exec<M extends MapOptions>(mapOptions?: M): Promise<
        FindOneResult<T, M>
    > {
        return MySQLOperation.FindOne.exec({
            target: this.target,
            sqlBuilder: this.toSQLBuilder(),
            mapOptions
        })
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected toSQLBuilder(): FindOneSQLBuilder<T> {
        return new FindOneSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}

export {
    type FindOneQueryOptions
}