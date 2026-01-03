import { EntityMetadata } from "../../Metadata"
import { BaseEntity } from "../../Entities"

// Procedures
import { UpdateOrCreate } from "../Procedures"

// SQL Builder
import CreateSQLBuilder from "../CreateSQLBuilder"
import FindOneSQLBuilder from "../FindOneSQLBuilder"

// Types
import type { Constructor } from "../../types"
import type { UpdateOrCreateAttributes } from "./types"
import type { EntityPropertiesKeys } from "../../types"

export default class UpdateOrCreateSQLBuilder<T extends BaseEntity> {
    protected metadata: EntityMetadata

    private create: CreateSQLBuilder<T>
    private _cols: EntityPropertiesKeys<T>[] = []
    private _vals: any[] = []
    private merged: boolean = false

    constructor(
        public target: Constructor<T>,
        public _attributes: BaseEntity | UpdateOrCreateAttributes<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = EntityMetadata.findOrThrow(this.target)
        this.create = new CreateSQLBuilder(
            this.target,
            this.attributes,
            this.alias
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get attributes(): UpdateOrCreateAttributes<T> {
        return (
            this.merged
                ? this._attributes
                : this._attributes = {
                    ...(
                        this._attributes instanceof BaseEntity
                            ? this._attributes.columns()
                            : this._attributes
                    ),

                    ...Object.fromEntries(this._cols.map((col, index) => [
                        col, this._vals[index]
                    ]))
                } as any
        ) as UpdateOrCreateAttributes<T>
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<T>[]): this {
        this._cols.push(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._vals.push(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: UpdateOrCreateAttributes<T>): this {
        this._attributes = attributes

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