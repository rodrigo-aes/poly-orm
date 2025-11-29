// Handlers
import { MetadataHandler } from "../../../Metadata"

import MySQL2RawDataHandler, {
    type DataFillMethod
} from "../../MySQL2RawDataHandler"

import EntityBuilder from "../../EntityBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    Entity,
    Target,
    TargetMetadata,
    Constructor,
    EntityTarget,
} from "../../../types"
import type { BaseEntity, BasePolymorphicEntity } from "../../../Entities"

import type { Collection } from "../../../Entities"

import type {
    CreationAttributes,
    CreationAttributesOptions
} from "../../../SQLBuilders"

import type { MySQL2RawData } from "../../MySQL2RawDataHandler"
import type { DeleteResult } from "../types"

export default class RelationQueryExecutionHandler<
    T extends BaseEntity | BasePolymorphicEntity<any>
> {
    protected metadata: TargetMetadata<Constructor<T>>

    constructor(public target: Constructor<T>) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeFindOne(sql: string): Promise<T | null> {
        return this
            .rawDataHandler('One', await this.metadata.connection.query(sql))
            .parseEntity() as T | null
    }

    // ------------------------------------------------------------------------

    public async executeFind(sql: string) {
        return this
            .rawDataHandler('Many', await this.metadata.connection.query(sql))
            .parseEntity() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public async executeCreate(
        sql: [string, any[]],
        attributes: CreationAttributes<T>
    ): Promise<T> {
        const resultHeader: ResultSetHeader = await this.metadata.connection
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as T
    }

    // ------------------------------------------------------------------------

    public async executeCreateMany(
        sql: [string, any[][]],
        attributes: CreationAttributes<T>[]
    ): Promise<Collection<T>> {
        const resultHeader: ResultSetHeader = await this.metadata.connection
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public async executeUpdateOrCreate(
        sql: string,
    ): Promise<T> {
        const [mySQL2RawData] = await this.metadata.connection.query(sql)

        return this
            .rawDataHandler('One', mySQL2RawData)
            .parseEntity(mySQL2RawData) as T
    }

    // ------------------------------------------------------------------------

    public async executeUpdate(sql: string): Promise<ResultSetHeader> {
        return await this.metadata.connection.query(sql) as any
    }

    // ------------------------------------------------------------------------

    public async executeDelete(sql: string): Promise<DeleteResult> {
        const { affectedRows, serverStatus }: ResultSetHeader = (
            await this.metadata.connection.query(sql) as any
        )

        return { affectedRows, serverStatus }
    }

    // ------------------------------------------------------------------------

    public async executeVoidOperation(sql: string, values?: any[]) {
        await this.metadata.connection.query(sql, values)
    }

    // Privates ---------------------------------------------------------------
    private rawDataHandler(
        fillMethod: DataFillMethod,
        rawData: MySQL2RawData
    ): MySQL2RawDataHandler<Target> {
        return new MySQL2RawDataHandler(
            this.target as Target,
            fillMethod,
            rawData
        )
    }

    // ------------------------------------------------------------------------

    private entityBuilder(
        attributes: CreationAttributesOptions<T>,
        primary: any | undefined
    ): EntityBuilder<EntityTarget> {
        return new EntityBuilder(
            this.target as EntityTarget,
            attributes,
            primary
        )
    }
}