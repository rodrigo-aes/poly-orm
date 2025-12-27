import { BasePolymorphicEntity } from "../../Entities"

// SQL Builders
import CountSQL from "./CountSQL"
import UnionSQLBuilder from "../UnionSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { ConditionalQueryJoinsHandler } from "../../Handlers"
import { SQLString } from "../../Handlers"

// Symbols
import { Case } from "../ConditionalSQLBuilder"

// Types
import type {
    Entity,
    Constructor,
    TargetMetadata,
    PolymorphicEntityTarget,
    Target
} from "../../types"
import type { AndQueryOptions } from "../ConditionalSQLBuilder"
import type { CountQueryOptions } from "./types"
import type { CountQueryOption, CountCaseOptions } from "./CountSQL"
import JoinSQLBuilder from "../JoinSQLBuilder"


export default class CountSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>

    private _unionSQLBuilders?: UnionSQLBuilder[]
    private _joinSQLBuilders?: JoinSQLBuilder<any>[]

    constructor(
        public target: Constructor<T>,
        public options: CountQueryOptions<T>,
        public alias: string = target.name.toLowerCase(),
        public type: 'isolated' | 'inline' = 'isolated',
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get joinSQLBuilders(): JoinSQLBuilder<any>[] {
        return this._joinSQLBuilders = this._joinSQLBuilders ?? (
            new ConditionalQueryJoinsHandler(this.target).joinsByKeys(
                this.extractOptionsRelationsKeys()
            )
        )
    }

    // ------------------------------------------------------------------------

    public get unionsSQLBuilders(): UnionSQLBuilder[] {
        return this._unionSQLBuilders = this._unionSQLBuilders ?? [
            ...this.targetUnion(),
            ...this.joinSQLBuilders.flatMap(join => join.unionSQLBuilders)
        ]
    }

    // Protecteds -------------------------------------------------------------
    protected get tableName(): string {
        return `${this.metadata.tableName} ${this.alias}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        switch (this.type) {
            case 'isolated': return this.isolatedCountQuery()
            case "inline": return CountSQLBuilder.inline(
                this.target,
                this.options,
                this.alias
            )
        }
    }
    // Privates ---------------------------------------------------------------
    private isolatedCountQuery(): string {
        return SQLString.sanitize(`
            ${this.unionsSQL()}
            SELECT ${this.countsSQL()}
            ${this.fromSQL()}
            ${this.joinsSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    private countsSQL(): string {
        return CountSQLBuilder.inline(
            this.target,
            this.options,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private fromSQL(): string {
        return `FROM ${this.tableName}`
    }

    // ------------------------------------------------------------------------

    private joinsSQL(): string {
        return this.joinSQLBuilders
            .map(joinSQLBuilder => joinSQLBuilder.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private unionsSQL(): string {
        return this.unionsSQLBuilders.map(union => union.SQL()).join(' ')
    }

    // ------------------------------------------------------------------------

    private targetUnion(): UnionSQLBuilder[] {
        return this.target.prototype instanceof BasePolymorphicEntity
            ? [
                new UnionSQLBuilder(
                    this.metadata.tableName,
                    this.target as PolymorphicEntityTarget
                )
            ]
            : []
    }

    // ------------------------------------------------------------------------

    private extractOptionsRelationsKeys(): string[] {
        return Object.values(this.options).flatMap(option => {
            if (typeof option === 'string') return (
                this.metadata.relations.search(option) ? option : []
            )

            if ((option as CountCaseOptions<T>)[Case]) return (
                (option as CountCaseOptions<T>)[Case]
                    .flatMap(option => Array.isArray(option)
                        ? this.extractAndRelationKeys(option[0])
                        : []
                    )
            )

            return Array.isArray(option)
                ? option.flatMap(and => this.extractAndRelationKeys(and))
                : this.extractAndRelationKeys(option)
        })
    }

    // ------------------------------------------------------------------------

    public extractAndRelationKeys(and: AndQueryOptions<any>): string[] {
        return Object.keys(and).filter(key => key.includes('.'))
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static inline<T extends Entity>(
        target: Constructor<T>,
        options: CountQueryOptions<T>,
        alias?: string,
    ): string {
        return Object
            .entries(options)
            .map(([as, options]) =>
                new CountSQL(target, options, as, alias).SQL()
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public static countBuilder<T extends Entity>(
        target: Constructor<T>,
        options: CountQueryOption<T>,
        alias?: string,
    ): CountSQLBuilder<T> {
        return new CountSQLBuilder(
            target,
            { result: options },
            alias
        )
    }

    // ------------------------------------------------------------------------

    public static countManyBuilder<T extends Entity>(
        target: Constructor<T>,
        options: CountQueryOptions<T>,
        alias?: string,
    ): CountSQLBuilder<T> {
        return new CountSQLBuilder(
            target,
            options,
            alias
        )
    }
}

export {
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions
}