import DataType from "../DataType"
import type { ComputedConfig, ComputedType } from "./types"

// Exceptions
import PolyORMException from "../../../../Errors"

export default class COMPUTED extends DataType {
    constructor(
        public dataType: DataType,
        public config: ComputedConfig
    ) {
        super('computed')

        if (['computed', 'json-ref'].includes(dataType.type)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_GENERATED_COLUMN_DATATYPE',
                dataType.constructor.name,
                'COMPUTED',
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
        return `AS (${this.config.as})`
    }
}

export {
    type ComputedConfig,
    type ComputedType
}