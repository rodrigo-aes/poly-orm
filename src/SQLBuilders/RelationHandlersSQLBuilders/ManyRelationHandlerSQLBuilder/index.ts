import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import {
    WhereSQLBuilder,
    type ConditionalQueryOptions
} from "../../ConditionalSQLBuilder"

import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Types
import type { ToManyRelationMetadata } from "../../../Metadata"
import type { Entity, EntityTarget } from "../../../types"

import type {
    CreateAttributes,
    UpdateAttributes
} from "../../../SQLBuilders"

import type {
    FindRelationQueryOptions,
} from "./types"

export default abstract class ManyRelationHandlerSQLBuilder<
    M extends ToManyRelationMetadata,
    T extends Entity,
    R extends Entity
> extends RelationHandlerSQLBuilder<M, T, R> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(options?: FindRelationQueryOptions<R>): string {
        return `${this.selectSQL()} ${this.whereSQL(options?.where)}`
    }

    // ------------------------------------------------------------------------

    public loadOneSQL(options?: FindRelationQueryOptions<R>): string {
        return `${this.loadSQL(options)} LIMIT 1`
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreateAttributes<R>): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.insertColumnsSQL(attributes)
        )}) VALUES (${this.insertValuesSQL(attributes)})`
    }

    // ------------------------------------------------------------------------

    public createManySQL(attributes: CreateAttributes<R>[]): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.bulkInsertColumns(attributes)
        )}) VALUES ${this.bulkInsertValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(attributes: CreateAttributes<R>): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.creationAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(
        attributes: UpdateAttributes<R>,
        where?: ConditionalQueryOptions<R>
    ): string {
        return `UPDATE ${this.relatedTable} ${this.setSQL(attributes)} ${(
            this.whereSQL(where)
        )}`
    }

    // ------------------------------------------------------------------------

    public deleteSQL(where?: ConditionalQueryOptions<R>): string {
        return `DELETE FROM ${this.relatedTable} ${this.whereSQL(where)}`
    }

    // Protecteds -------------------------------------------------------------
    protected whereSQL(where?: ConditionalQueryOptions<R>): string {
        return this.fixedWhereSQL() + this.andSQL(where)
    }

    // ------------------------------------------------------------------------

    protected andSQL(where?: ConditionalQueryOptions<R>): string {
        return where
            ? ` AND ${(
                new WhereSQLBuilder(
                    this.related,
                    where as ConditionalQueryOptions<R>
                )
                    .conditionalSQL()
            )}`
            : ''
    }

    // ------------------------------------------------------------------------

    protected bulkInsertColumns(attributes: CreateAttributes<R>[]): string {
        return Array
            .from(new Set(attributes.flatMap(
                att => Object.keys(this.creationAttributes(att))
            )))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected bulkInsertValuesSQL(attributes: CreateAttributes<R>[]): string {
        return attributes
            .map(att => `(${this.insertValuesSQL(att)})`)
            .join(', ')
    }
}

export type {
    FindRelationQueryOptions
}