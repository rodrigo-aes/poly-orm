// Handlers
import MySQLDataHandler from "../../MySQLDataHandler"
import { MetadataHandler } from "../../../Metadata"

// Types
import type { Entity, Constructor } from "../../../types"
import type { FillMethod } from "../../MySQLDataHandler"
import type {
    SQLBuilder,
    MapOptions,
    CollectMapOptions,
    ExecOptions,
} from "./types"

// Exceptions
import PolyORMException from "../../../Errors"

export default class OperationHandler {
    declare static readonly fillMethod: FillMethod

    constructor() {
        PolyORMException.Common.throw(
            'NOT_INSTANTIABLE_CLASS', this.constructor.name
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static exec(options: ExecOptions<any, any, any>): Promise<any> {
        throw PolyORMException.Common.instantiate(
            'UNIMPLEMENTED_METHOD',
            'exec',
            'OperationHandler',
            this.name
        )
    }

    // Protecteds -------------------------------------------------------------
    protected static execQuery<T extends Entity, B extends SQLBuilder>(
        target: Constructor<T>,
        sqlBuilder: B,
    ): Promise<any> {
        return MetadataHandler.targetMetadata(target).connection.query(
            sqlBuilder.SQL()
        )
    }

    // ------------------------------------------------------------------------

    protected static async execMappedQuery<
        T extends Entity,
        B extends SQLBuilder,
        M extends MapOptions | CollectMapOptions<T>
    >(
        {
            target,
            sqlBuilder,
            mapOptions,
            toSource,
            pagination
        }: ExecOptions<T, B, M>
    ): Promise<any> {
        return MySQLDataHandler.parse({
            target: target,
            raw: await this.execQuery(target, sqlBuilder),
            fillMethod: this.fillMethod,
            mapOptions,
            toSource,
            pagination
        })
    }
}