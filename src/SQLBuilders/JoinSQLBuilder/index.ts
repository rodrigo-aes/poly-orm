

import { BasePolymorphicEntity } from "../../Entities"

import { MetadataHandler } from "../../Metadata"

// Query Builders
import SelectSQLBuilder, { type SelectOptions } from "../SelectSQLBuilder"

import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

import UnionSQLBuilder from "../UnionSQLBuilder"

// Types
import type {
    Entity,
    Target,
    Constructor,
    PolymorphicEntityTarget,
    TargetMetadata
} from "../../types"
import type { RelationMetadata } from "../../Metadata"
import type { RelationOptions, RelationsOptions } from "./types"

export default class JoinSQLBuilder<T extends Entity> {
    private relatedMetadata: TargetMetadata<any>

    private required?: boolean
    private selectOpts?: SelectOptions<any>
    private onOpts?: ConditionalQueryOptions<any>

    private _select?: SelectSQLBuilder<any>
    private _union?: UnionSQLBuilder

    constructor(
        public target: Constructor<T>,
        public relation: RelationMetadata,
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

    public get table(): string {
        return `${this.relatedMetadata.tableName} ${this.relatedAlias}`
    }

    // ------------------------------------------------------------------------

    public get select(): SelectSQLBuilder<any> {
        return this._select ??= new SelectSQLBuilder(
            this.relatedTarget,
            this.selectOpts,
            this.relatedAlias
        )

    }

    // ------------------------------------------------------------------------

    public get union(): UnionSQLBuilder | undefined {
        return this._union ??= (
            this.relatedTarget.prototype instanceof BasePolymorphicEntity
                ? new UnionSQLBuilder(
                    this.relatedMetadata.tableName,
                    this.relatedTarget as PolymorphicEntityTarget
                )
                : undefined
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `${this.joinSQL()} ${this.table} ${this.onSQL()}`
    }

    // ------------------------------------------------------------------------

    public joinSQL(): string {
        return this.required ? 'INNER JOIN' : 'LEFT JOIN'
    }

    // Privates ---------------------------------------------------------------
    private onSQL(): string {
        return ConditionalSQLBuilder.on(
            this.target,
            this.relation.relatedTarget,
            this.relation,
            this.onOpts,
            this.alias,
            this.relatedAlias,
        )
            .SQL()
    }
}

export {
    type RelationOptions,
    type RelationsOptions
}