import { EntityMetadata } from "../../Metadata"
import { BaseEntity } from "../../Entities"

// Procedures
import { UpdateOrCreate } from "../Procedures"

// SQL Builder
import CreateSQLBuilder, {
    type CreateAttributes
} from "../CreateSQLBuilder"
import FindOneSQLBuilder from "../FindOneSQLBuilder"

// Types
import type { Constructor } from "../../types"
import type { UpdateOrCreateAttributes } from "./types"
import type { EntityPropsKeys } from "../../types"

export default class UpdateOrCreateSQLBuilder<T extends BaseEntity> {
    protected metadata: EntityMetadata

    private create: CreateSQLBuilder<T>
    private _cols: EntityPropsKeys<T>[] = []
    private _vals: any[] = []
    private _merged: boolean = false
    private _att: BaseEntity | CreateAttributes<T>

    constructor(
        public target: Constructor<T>,
        attributes: BaseEntity | CreateAttributes<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = EntityMetadata.findOrThrow(this.target)
        this._att = attributes
        this.create = new CreateSQLBuilder(
            this.target,
            this._att instanceof BaseEntity
                ? this._att.columns() as CreateAttributes<T>
                : this._att,
            this.alias
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get attributes(): UpdateOrCreateAttributes<T> {
        return this._att = this._merged ? this._att : this._merge
    }

    // Privates ---------------------------------------------------------------
    private get _merge(): any {
        this._merged = true
        return Object.fromEntries(this._attEntries.concat(this._colsEntries))
    }

    // ------------------------------------------------------------------------

    private get _attEntries(): [string, any][] {
        return this._att instanceof BaseEntity
            ? this._att.entries()
            : Object.entries(this._att)
    }

    // ------------------------------------------------------------------------

    private get _colsEntries(): [string, any][] {
        return this._cols.map((col, index) => [col, this._vals[index]])
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropsKeys<T>[]): this {
        this._cols.push(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._vals.push(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: CreateAttributes<T>): this {
        this._att = attributes
        return this
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return UpdateOrCreate
            .connection(this.metadata.connection)
            .callSQL(this.insertOrUpdateSQL(), this.selectSQL())
    }

    // ------------------------------------------------------------------------

    public insertOrUpdateSQL(): string {
        return `${this.create.SQL()} ON DUPLICATE KEY UPDATE ${(
            this.updateValuesSQL()
        )}`
    }

    // ------------------------------------------------------------------------

    public updateValuesSQL(): string {
        return this.create.cols
            .map((column: string) => `${column} = VALUES(${column})`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return new FindOneSQLBuilder(
            this.target,
            { where: this.attributes as any },
            this.alias
        )
            .SQL()
    }
}

export {
    type UpdateOrCreateAttributes
}