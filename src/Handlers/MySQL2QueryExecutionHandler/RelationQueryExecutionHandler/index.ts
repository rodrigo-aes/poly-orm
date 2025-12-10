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

export default class RelationQueryExecutionHandler<T extends Entity> {
    protected metadata: TargetMetadata<Constructor<T>>

    constructor(public target: Constructor<T>) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeFindOne(sql: string): Promise<T | null> {
        return this
            .rawDataHandler('One', await this.metadata.connection.query(sql))
            .entity() as T | null
    }

    // ------------------------------------------------------------------------

    public async executeFind(sql: string) {
        return this
            .rawDataHandler('Many', await this.metadata.connection.query(sql))
            .entity() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public async executeCreate(
        sql: string,
        attributes: CreationAttributes<T>
    ): Promise<T> {
        return this.entityBuilder(
            attributes,
            (await this.metadata.connection.query(sql) as any).insertId
        )
            .build() as T
    }

    // ------------------------------------------------------------------------

    public async executeCreateMany(
        sql: string,
        attributes: CreationAttributes<T>[]
    ): Promise<Collection<T>> {
        return this.entityBuilder(
            attributes,
            (await this.metadata.connection.query(sql) as any).insertId
        )
            .build() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public async executeUpdateOrCreate(sql: string): Promise<T> {
        return this
            .rawDataHandler(
                'One',
                (await this.metadata.connection.query(sql) as any[])[0]
            )
            .entity() as T
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