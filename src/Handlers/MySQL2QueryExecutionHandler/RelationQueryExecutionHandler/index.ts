// Handlers
import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../../Metadata"

import MySQL2RawDataHandler, {
    type DataFillMethod
} from "../../MySQL2RawDataHandler"

import EntityBuilder from "../../EntityBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type { PolyORMConnection } from "../../../Metadata"
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

import type { Collection } from "../../../Entities"

import type {
    CreationAttributes,
    CreationAttributesOptions
} from "../../../SQLBuilders"

import type { MySQL2RawData } from "../../MySQL2RawDataHandler"
import type { DeleteResult } from "../types"

export default class RelationQueryExecutionHandler<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    constructor(public target: T) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeFindOne(sql: string): Promise<InstanceType<T> | null> {
        return this
            .rawDataHandler('One', await this.metadata.connection.query(sql))
            .parseEntity() as InstanceType<T> | null
    }

    // ------------------------------------------------------------------------

    public async executeFind(sql: string) {
        return this
            .rawDataHandler('Many', await this.metadata.connection.query(sql))
            .parseEntity() as Collection<InstanceType<T>>
    }

    // ------------------------------------------------------------------------

    public async executeCreate(
        sql: [string, any[]],
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        const resultHeader: ResultSetHeader = await this.metadata.connection
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as (
                InstanceType<T>
            )
    }

    // ------------------------------------------------------------------------

    public async executeCreateMany(
        sql: [string, any[][]],
        attributes: CreationAttributes<InstanceType<T>>[]
    ): Promise<Collection<InstanceType<T>>> {
        const resultHeader: ResultSetHeader = await this.metadata.connection
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as (
                Collection<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public async executeUpdateOrCreate(
        sql: string,
    ): Promise<InstanceType<T>> {
        const [mySQL2RawData] = await this.metadata.connection.query(sql)

        return this
            .rawDataHandler('One', mySQL2RawData)
            .parseEntity(mySQL2RawData) as InstanceType<T>
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
    ): (
            MySQL2RawDataHandler<T>
        ) {
        return new MySQL2RawDataHandler(
            this.target,
            fillMethod,
            rawData
        )
    }

    // ------------------------------------------------------------------------

    private entityBuilder(
        attributes: CreationAttributesOptions<InstanceType<T>>,
        primary: any | undefined
    ): EntityBuilder<Extract<T, EntityTarget>> {
        return new EntityBuilder(
            this.target as EntityTarget,
            attributes,
            primary
        ) as EntityBuilder<Extract<T, EntityTarget>>
    }
}