

import BasePolymorphicEntity from "../../BasePolymorphicEntity"

import { MetadataHandler } from "../../Metadata"

// Query Builders
import SelectSQLBuilder, { type SelectOptions } from "../SelectSQLBuilder"

import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

import UnionSQLBuilder from "../UnionSQLBuilder"

// Types
import type {
    Target,
    PolymorphicEntityTarget,
    TargetMetadata
} from "../../types"
import type { RelationMetadataType } from "../../Metadata"
import type { RelationOptions, RelationsOptions } from "./types"

export default class JoinSQLBuilder<T extends Target> {
    private relatedMetadata: TargetMetadata<any>

    public required?: boolean
    public select?: SelectOptions<any>
    public on?: ConditionalQueryOptions<any>

    private _selectSQLBuilder?: SelectSQLBuilder<any>
    private _unionSQLBuilders?: UnionSQLBuilder[]

    constructor(
        public target: T,
        public relation: RelationMetadataType,
        options?: Omit<RelationOptions<any>, 'relations'>,
        public alias: string = target.name.toLowerCase(),
        public relatedAlias: string = `${alias}_${relation.name}`,
    ) {
        Object.assign(this, options)

        this.relatedMetadata = MetadataHandler.targetMetadata(
            this.relatedTarget
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): Target {
        return this.relation.relatedTarget
    }

    // ------------------------------------------------------------------------

    public get selectSQLBuilder(): SelectSQLBuilder<any> {
        return this._selectSQLBuilder ??= new SelectSQLBuilder(
            this.relatedTarget,
            this.select,
            this.relatedAlias
        )

    }

    // ------------------------------------------------------------------------

    public get unionSQLBuilders(): UnionSQLBuilder[] {
        return this._unionSQLBuilders = this._unionSQLBuilders ?? (
            this.handleUnionSQLBuilders()
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return [
            this.joinType(),
            this.tableSQL(),
            this.onSQL(),
        ]
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public joinType(): string {
        return this.required
            ? 'INNER JOIN'
            : 'LEFT JOIN'
    }

    // ------------------------------------------------------------------------

    public tableSQL(): string {
        return `${this.relatedMetadata.tableName} ${this.relatedAlias}`
    }

    // Privates ---------------------------------------------------------------
    private onSQL(): string {
        return ConditionalSQLBuilder.on(
            this.target,
            this.relation.relatedTarget,
            this.relation,
            this.on,
            this.alias,
            this.relatedAlias,
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private handleUnionSQLBuilders(): UnionSQLBuilder[] {
        return this.relatedTarget.prototype instanceof BasePolymorphicEntity
            ? [
                new UnionSQLBuilder(
                    this.relatedMetadata.tableName,
                    this.relatedTarget as PolymorphicEntityTarget
                )
            ]
            : []
    }
}

export {
    type RelationOptions,
    type RelationsOptions
}