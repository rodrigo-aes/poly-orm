import DataType from "../DataType"
import type { JSONColumnConfig } from "./types"

// Exceptions
import PolyORMException from "../../../../Errors"

export default class JSONRef extends DataType {
    constructor(public dataType: DataType, public config: JSONColumnConfig) {
        super('json-ref')

        if (['computed', 'json-ref'].includes(dataType.type)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_GENERATED_COLUMN_DATATYPE',
                dataType.constructor.name,
                'JSONRef',
            )
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `${this.dataType.buildSQL()} GENERATED ALWAYS ${this.as()} ${(
            this.config.type
        )}`
    }

    // Privates ---------------------------------------------------------------
    private as() {
        return `AS (JSON_UNQUOTE(JSON_EXTRACT(${this.config.json}, '$.${(
            this.config.path
        )}'))`
    }
}

export type {
    JSONColumnConfig
}