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

    private createSQLBuilder: CreateSQLBuilder<T>
    private _columns: EntityPropertiesKeys<T>[] = []
    private _values: any[] = []

    constructor(
        public target: Constructor<T>,
        public _attributes: BaseEntity | UpdateOrCreateAttributes<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = EntityMetadata.findOrThrow(this.target)
        this.createSQLBuilder = new CreateSQLBuilder(
            this.target,
            this.attributes,
            this.alias
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get attributes(): UpdateOrCreateAttributes<T> {
        return {
            ...this._attributes instanceof BaseEntity
                ? this._attributes.columns()
                : this._attributes,
            ...Object.fromEntries(this._columns.map(
                (column, index) => [column, this._values[index]]
            ))
        } as UpdateOrCreateAttributes<T>
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<T>[]): this {
        this._columns.push(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._values.push(...values)
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
        return `${this.createSQLBuilder.SQL()} ON DUPLICATE KEY UPDATE ${(
            this.updateValuesSQL()
        )}`
    }

    // ------------------------------------------------------------------------

    public updateValuesSQL(): string {
        return this.createSQLBuilder.columnsNames
            .map((column: string) => `${column} = VALUES(${column})`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return new FindOneSQLBuilder(
            this.target,
            {
                where: this.attributes as any
            },
            this.alias
        )
            .SQL()
    }
}

export {
    type UpdateOrCreateAttributes
}