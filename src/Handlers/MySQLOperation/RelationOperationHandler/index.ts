// Handlers
import MySQLDataHandler from "../../MySQLDataHandler"
import EntityBuilder from "../../EntityBuilder"
import { MetadataHandler } from "../../../Metadata"

// Types
import type { ResultSetHeader } from "mysql2"
import type { Entity, Target, Constructor } from "../../../types"
import type { BaseEntity, Collection } from "../../../Entities"
import type { CreateAttributes } from "../../../SQLBuilders"
import type { DeleteResult } from "../OperationHandlers"

export default class RelationOperationHandler {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public static async findOne<T extends Entity>(
        target: Constructor<T>,
        sql: string
    ): Promise<T | null> {
        return MySQLDataHandler.parse({
            target,
            raw: await this.query(target, sql),
            fillMethod: 'One',
            mapOptions: {
                mapTo: 'entity'
            }
        }) as T | null
    }

    // ------------------------------------------------------------------------

    public static async find<T extends Entity>(
        target: Constructor<T>,
        sql: string
    ): Promise<Collection<T>> {
        return MySQLDataHandler.parse({
            target,
            raw: await this.query(target, sql),
            fillMethod: 'Many',
            mapOptions: {
                mapTo: 'entity'
            }
        }) as Collection<T>
    }

    // ------------------------------------------------------------------------

    public static async create<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreateAttributes<T>
    ): Promise<T> {
        await this.query(target, sql)
        return EntityBuilder.build(target, attributes) as T
    }

    // ------------------------------------------------------------------------

    public static async createMany<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreateAttributes<T>[]
    ): Promise<Collection<T>> {
        await this.query(target, sql)
        return EntityBuilder.build(target, attributes) as Collection<T>
    }

    // ------------------------------------------------------------------------

    public static async updateOrCreate<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreateAttributes<T>
    ): Promise<T> {
        await this.query(target, sql)
        return EntityBuilder.build(target, attributes) as T
    }

    // ------------------------------------------------------------------------

    public static async update(target: Target, sql: string): Promise<
        ResultSetHeader
    > {
        return this.query(target, sql)
    }

    // ------------------------------------------------------------------------

    public static async delete(target: Target, sql: string): Promise<
        DeleteResult
    > {
        const { affectedRows, serverStatus }: ResultSetHeader = (
            await this.query(target, sql)
        )

        return { affectedRows, serverStatus }
    }

    // ------------------------------------------------------------------------

    public static async voidOperation(
        target: Target,
        sql: string,
        values?: any[]
    ): Promise<any> {
        return this.query(target, sql, values)
    }

    // Privates ---------------------------------------------------------------
    private static query<T extends Entity>(
        target: Constructor<T>,
        sql: string,
        values?: any[]
    ): Promise<any> {
        return MetadataHandler.targetMetadata(target).connection.query(
            sql, values
        )
    }
}