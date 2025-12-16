// Handlers
import MySQLDataHandler from "../../MySQLDataHandler"
import EntityBuilder from "../../EntityBuilder"
import { MetadataHandler } from "../../../Metadata"

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    Entity,
    Target,
    Constructor,
} from "../../../types"
import type { BaseEntity, Collection } from "../../../Entities"
import type { CreationAttributes } from "../../../SQLBuilders"
import type { DeleteResult } from "../OperationHandlers"

export default class RelationOperationHandler {

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public static async findOne<T extends Entity>(
        target: Constructor<T>,
        sql: string
    ): Promise<T | null> {
        return new MySQLDataHandler(
            target,
            'One',
            await this.query(target, sql)
        )
            .entity() as T | null
    }

    // ------------------------------------------------------------------------

    public static async find<T extends Entity>(
        target: Constructor<T>,
        sql: string
    ): Promise<Collection<T>> {
        return new MySQLDataHandler(
            target,
            'Many',
            await this.query(target, sql)
        )
            .entity() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public static async create<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreationAttributes<T>
    ): Promise<T> {
        return new EntityBuilder(
            target,
            attributes,
            (await this.query(target, sql) as any).insertId
        )
            .build() as T
    }

    // ------------------------------------------------------------------------

    public static async createMany<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreationAttributes<T>[]
    ): Promise<Collection<T>> {
        return new EntityBuilder(
            target,
            attributes,
            (await this.query(target, sql) as any).insertId
        )
            .build() as Collection<T>
    }

    // ------------------------------------------------------------------------

    public static async updateOrCreate<T extends BaseEntity>(
        target: Constructor<T>,
        sql: string,
        attributes: CreationAttributes<T>
    ): Promise<T> {
        return new EntityBuilder(
            target,
            attributes,
            (await this.query(target, sql))[0]
        )
            .build() as T
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