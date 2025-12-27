import AbstractDataType from './DataType'

// DataTypes
import CHAR from './CHAR'
import VARCHAR from "./VARCHAR"
import TEXT, { type TextLength } from './TEXT'
import INT, { type IntegerLength } from './INT'
import FLOAT from "./FLOAT"
import DECIMAL from "./DECIMAL"
import DOUBLE from "./DOUBLE"
import BOOLEAN from "./BOOLEAN"
import ENUM from "./ENUM"
import SET from "./SET"
import TIMESTAMP from "./TIMESTAMP"
import DATETIME from "./DATETIME"
import DATE from "./DATE"
import TIME from "./TIME"
import YEAR from "./YEAR"
import JSON from "./JSON"
import JSONReference, { type JSONColumnConfig } from "./JSONReference"
import BIT, { type BitLength } from './BIT'
import BINARY from "./BINARY"
import VARBINARY from "./VARBINARY"
import BLOB, { type BlobLength } from './BLOB'
import COMPUTED, {
    type ComputedType
} from './COMPUTED'

import type { DataTypeMetadataJSON } from './types'

// Exceptions
import PolyORMException from '../../../Errors'

export default class DataType extends AbstractDataType {
    private constructor() {
        PolyORMException.Common.throw('NOT_INSTANTIABLE_CLASS', 'DataType')
        super('char')
    }

    public buildSQL(): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', this.constructor.name, 'buildSQL'
        )
    }

    // Static Methods =========================================================
    public static isDataType(object: any): boolean {
        return object instanceof AbstractDataType
    }

    // ------------------------------------------------------------------------

    public static CHAR(length?: number): CHAR {
        return new CHAR(length)
    }

    // ------------------------------------------------------------------------

    public static VARCHAR(length?: number) {
        return new VARCHAR(length)
    }

    // ------------------------------------------------------------------------

    public static TEXT(length?: TextLength) {
        return new TEXT(length)
    }

    // ------------------------------------------------------------------------

    public static INT(length?: IntegerLength) {
        return new INT(length)
    }

    // ------------------------------------------------------------------------

    public static FLOAT(M: number, D: number) {
        return new FLOAT(M, D)
    }

    // ------------------------------------------------------------------------

    public static DECIMAL(M: number, D: number) {
        return new DECIMAL(M, D)
    }

    // ------------------------------------------------------------------------

    public static DOUBLE(M: number, D: number) {
        return new DOUBLE(M, D)
    }

    // ------------------------------------------------------------------------

    public static BOOLEAN() {
        return new BOOLEAN
    }

    // ------------------------------------------------------------------------

    public static ENUM(...options: string[]) {
        return new ENUM(...options)
    }

    // ------------------------------------------------------------------------

    public static SET(...options: string[]) {
        return new SET(...options)
    }

    // ------------------------------------------------------------------------

    public static TIMESTAMP() {
        return new TIMESTAMP
    }

    // ------------------------------------------------------------------------

    public static DATETIME() {
        return new DATETIME
    }

    // ------------------------------------------------------------------------

    public static DATE() {
        return new DATE
    }

    // ------------------------------------------------------------------------

    public static TIME() {
        return new TIME
    }

    // ------------------------------------------------------------------------

    public static YEAR() {
        return new YEAR
    }

    // ------------------------------------------------------------------------

    public static JSON() {
        return new JSON
    }

    // ------------------------------------------------------------------------

    public static JSONReference(type: DataType, config: JSONColumnConfig) {
        return new JSONReference(type, config)
    }

    // ------------------------------------------------------------------------

    public static BIT(length?: BitLength) {
        return new BIT(length)
    }

    // ------------------------------------------------------------------------

    public static BINARY(length: number) {
        return new BINARY(length)
    }

    // ------------------------------------------------------------------------

    public static VARBINARY(length: number) {
        return new VARBINARY(length)
    }

    // ------------------------------------------------------------------------

    public static BLOB(length?: BlobLength) {
        return new BLOB(length)
    }

    // ------------------------------------------------------------------------

    public static COMPUTED(
        dataType: DataType,
        as: string,
        type: ComputedType = 'STORED'
    ) {
        return new COMPUTED(dataType, {
            as,
            type
        })
    }
}

export {
    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,

    type DataTypeMetadataJSON,
    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
}