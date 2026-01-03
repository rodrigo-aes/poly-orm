// SQL Builders
import ConditionalSQLBuilder, { Case } from "../ConditionalSQLBuilder"
import CountSQLBuilder from "../CountSQLBuilder"
import GroupSQLBuilder, { type GroupQueryOptions } from "../GroupSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { SQLString } from "../../Handlers"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../types"
import type {
    SelectOptions,
    SelectColumnsOption,
    SelectCaseOption,
    SelectPropertyOptions
} from "./types"

export default class SelectSQLBuilder<T extends Entity> {
    private metadata: TargetMetadata<T>
    private merged: string[] = []

    private _properties?: string[]

    constructor(
        public target: Constructor<T>,
        public options?: SelectOptions<T>,
        public alias: string = target.name.toLowerCase(),
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get properties(): string[] {
        return this._properties ??= this.propertiesSQL()
            .concat(
                this.countsSQL(),
                this.merged
            )
    }

    // Privates ---------------------------------------------------------------
    private get columns(): string[] {
        return this.options?.properties
            ?.filter(option => typeof option === 'string')
            ?? []
    }

    // ------------------------------------------------------------------------

    private get cases(): SelectCaseOption<T>[] {
        return this.options?.properties
            ?.filter(option => typeof option === 'object')
            ?? []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(options: SelectOptions<T>) {
        this.options = options
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return `SELECT ${this.properties.join(', ')} ${this.fromSQL()}`
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string[] {
        return this.options?.properties
            ? this.handlePropertiesSQL()
            : this.allColumnsSQL()
    }

    // ------------------------------------------------------------------------

    public countsSQL(): string[] {
        return this.options?.count
            ? [
                CountSQLBuilder.inline(
                    this.target,
                    this.options.count,
                    this.alias
                )
            ]
            : []
    }

    // ------------------------------------------------------------------------

    public merge(select: SelectSQLBuilder<any>): void {
        this.merged.push(...select.properties)
    }

    // ------------------------------------------------------------------------

    public groupQueryBuilder(): GroupSQLBuilder<T> {
        return new GroupSQLBuilder(
            this.target,
            this.groupColumns(),
            this.alias
        )
    }

    // Privates ---------------------------------------------------------------
    private handlePropertiesSQL(): string[] {
        return this.selectedColumnsSQL().concat(this.casesSQL())
    }

    // ------------------------------------------------------------------------

    private allColumnsSQL(): string[] {
        return this.metadata.columns.map(column => `${this.as(column.name)}`)
    }

    // ------------------------------------------------------------------------

    private selectedColumnsSQL(): string[] {
        return this.columns.includes('*')
            ? this.allColumnsSQL()
            : this.columns.map(prop => this.as(prop))
    }

    // ------------------------------------------------------------------------

    private casesSQL(): string[] {
        return this.cases.map(
            caseOpt => ConditionalSQLBuilder.case(
                this.target,
                caseOpt[Case],
                caseOpt.as,
                this.alias
            )
                .SQL()
        )
    }

    // ------------------------------------------------------------------------

    private fromSQL(): string {
        return `FROM ${this.metadata.tableName} ${this.alias}`
    }

    // ------------------------------------------------------------------------

    private as(column: string): string {
        return `${this.alias}.${column} AS ${this.alias}_${column}`
    }

    // ------------------------------------------------------------------------

    private groupColumns(): GroupQueryOptions<T> {
        return this.options?.properties
            ? this.selectedGroupColumns()
            : this.allGroupColumns()
    }

    // ------------------------------------------------------------------------

    private allGroupColumns(): GroupQueryOptions<T> {
        return this.metadata.columns.map(
            ({ name }) => this.groupColumn(name)
        ) as GroupQueryOptions<T>
    }

    // ------------------------------------------------------------------------

    private selectedGroupColumns(): GroupQueryOptions<T> {
        return (
            this.columns.includes('*')
                ? this.allGroupColumns()
                : this.columns.map(column => this.groupColumn(column))
        ) as GroupQueryOptions<T>
    }

    // ------------------------------------------------------------------------

    private groupColumn(column: string): string {
        return SQLString.pathToAlias(column, this.alias)
    }
}

export {
    type SelectOptions,
    type SelectColumnsOption as SelectPropertyKey,
    type SelectCaseOption as SelectCaseClause,
    type SelectPropertyOptions,
}