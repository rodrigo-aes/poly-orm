// Handlers
import { MetadataHandler, type PolyORMConnection } from "../../../Metadata"
import MySQLDataHandler, { type FillMethod } from "../../MySQLDataHandler"

// Types
import type { Entity, Constructor } from "../../../types"
import type { PaginationInitMap } from "../../../Entities"
import type {
    SQLBuilder,
    MapOptions,
    CollectMapOptions
} from "./types"

export default abstract class OperationHandler<
    T extends Entity,
    B extends SQLBuilder,
    M extends MapOptions | CollectMapOptions<T>
> {
    public abstract readonly fillMethod: FillMethod
    public connection: PolyORMConnection

    constructor(
        public target: Constructor<T>,
        public sqlBuilder: B,
        public mapOptions?: M,
        public toSource: boolean = false
    ) {
        this.connection = MetadataHandler.targetMetadata(target).connection
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract exec(): Promise<any>

    // Protecteds -------------------------------------------------------------
    protected execQuery(): Promise<any> {
        return this.connection.query(this.sqlBuilder.SQL())
    }

    // ------------------------------------------------------------------------

    protected async execMappedQuery(): Promise<any> {
        return this.map(await this.execQuery())
    }

    // ------------------------------------------------------------------------

    protected map(data: any, pagination?: PaginationInitMap): any {
        return MySQLDataHandler.parse({
            target: this.target,
            raw: data,
            fillMethod: this.fillMethod,
            mapOptions: this.mapOptions,
            pagination,
            toSource: this.toSource
        })
    }
}