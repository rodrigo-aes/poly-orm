import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import {
    WhereSQLBuilder,
    type ConditionalQueryOptions
} from "../../ConditionalSQLBuilder"

import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Types
import type { ManyRelationMetadatatype } from "../../../Metadata"
import type { Entity, EntityTarget } from "../../../types"

import type {
    RelationCreationAttributes,
    RelationUpdateAttributes,
    RelationUpdateOrCreateAttributes
} from "../OneRelationHandlerSQLBuilder"

import type {
    FindRelationQueryOptions,
    RelationCreateManyAttributes,
    RelationConditionalQueryOptions,
} from "./types"

export default abstract class ManyRelationHandlerSQLBuilder<
    RelationMetadata extends ManyRelationMetadatatype,
    T extends Entity,
    R extends Entity
> extends RelationHandlerSQLBuilder<
    RelationMetadata,
    T,
    R
> {
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

    public createSQL(attributes: RelationCreationAttributes<R>): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.insertColumnsSQL(attributes)
        )}) VALUES (${this.insertValuesSQL(attributes)})`
    }

    // ------------------------------------------------------------------------

    public createManySQL(
        attributes: RelationCreateManyAttributes<R>
    ): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.bulkInsertColumns(attributes)
        )}) VALUES ${this.bulkInsertValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(
        attributes: RelationUpdateOrCreateAttributes<R>
    ): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.creationAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(
        attributes: RelationUpdateAttributes<R>,
        where?: RelationConditionalQueryOptions<R>
    ): string {
        return `UPDATE ${this.relatedTable} ${this.setSQL(attributes)} ${(
            this.whereSQL(where)
        )}`
    }

    // ------------------------------------------------------------------------

    public deleteSQL(where?: RelationConditionalQueryOptions<R>): string {
        return `DELETE FROM ${this.relatedTable} ${this.whereSQL(where)}`
    }

    // Protecteds -------------------------------------------------------------
    protected whereSQL(where?: RelationConditionalQueryOptions<R>): string {
        return this.fixedWhereSQL() + this.andSQL(where)
    }

    // ------------------------------------------------------------------------

    protected andSQL(where?: RelationConditionalQueryOptions<R>): string {
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

    protected bulkInsertColumns(
        attributes: RelationCreateManyAttributes<R>
    ): string {
        return Array
            .from(new Set(attributes.flatMap(
                att => Object.keys(this.creationAttributes(att))
            )))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected bulkInsertValuesSQL(
        attributes: RelationCreateManyAttributes<R>
    ): string {
        return attributes
            .map(att => `(${this.insertValuesSQL(att)})`)
            .join(', ')
    }
}

export type {
    FindRelationQueryOptions,
    RelationCreateManyAttributes,
    RelationConditionalQueryOptions,
}