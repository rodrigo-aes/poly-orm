import { HooksMetadata } from "../../../Metadata"
import { Entity as EntityBase, type BaseEntity } from "../../../Entities"

// Types
import type { Entity, Constructor } from "../../../types"

import type {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    DeleteSQLBuilder,
} from "../../../SQLBuilders"

import type {
    ExecOptions,
    FindByPkOperation,
    FindOneOperation,
    FindOperation,
    PaginateOperation,
    CreateOperation,
    UpdateOperation,
    DeleteOperation,

    DeleteResult,
} from "../OperationHandlers"

import type { ResultSetHeader } from "mysql2"

export default class Hooks {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static Find<
        T extends typeof FindByPkOperation | typeof FindOneOperation
    >(
        _: T,
        __: string,
        descriptor: TypedPropertyDescriptor<
            (options: ExecOptions<any, any, any>) => Promise<any>
        >
    ) {
        const process = descriptor.value!

        descriptor.value = async function (
            this: T,
            options: ExecOptions<any, any, any>
        ) {
            await Hooks.beforeFind(options.target, options.sqlBuilder)
            return await Hooks.afterFind(
                options.target, await process.apply(this, [options])
            )
        }
    }

    // ------------------------------------------------------------------------

    public static BulkFind<
        T extends typeof FindOperation | typeof PaginateOperation
    >(
        _: T,
        __: string,
        descriptor: TypedPropertyDescriptor<
            (options: ExecOptions<any, any, any>) => Promise<any>
        >
    ) {
        const process = descriptor.value!

        descriptor.value = async function (
            this: T,
            options: ExecOptions<any, any, any>
        ) {
            await Hooks.beforeBulkFind(options.target, options.sqlBuilder)
            return await Hooks.afterBulkFind(
                options.target, await process.apply(this, [options])
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Create(
        _: typeof CreateOperation,
        __: string,
        descriptor: TypedPropertyDescriptor<
            (options: ExecOptions<any, any, any>) => Promise<any>
        >
    ) {
        const process = descriptor.value!

        descriptor.value = async function (
            this: typeof CreateOperation,
            options: ExecOptions<any, any, any>
        ) {
            await Hooks.beforeCreate(options.target, options.sqlBuilder)
            return await Hooks.afterCreate(
                options.target, await process.apply(this, [options])
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Update(
        _: typeof UpdateOperation,
        __: string,
        descriptor: TypedPropertyDescriptor<
            (options: ExecOptions<any, any, never>) => Promise<any>
        >
    ) {
        const process = descriptor.value!

        descriptor.value = async function (
            this: typeof UpdateOperation,
            options: ExecOptions<any, any, never>
        ) {
            await Hooks.beforeUpdate(options.target, options.sqlBuilder)
            return await Hooks.afterUpdate(
                options.target, options.sqlBuilder, await process.apply(
                    this, [options]
                )
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Delete(
        _: typeof DeleteOperation,
        __: string,
        descriptor: TypedPropertyDescriptor<
            (options: ExecOptions<any, any, never>) => Promise<any>
        >
    ) {
        const process = descriptor.value!

        descriptor.value = async function (
            this: typeof DeleteOperation,
            options: ExecOptions<any, any, never>
        ) {
            await Hooks.beforeDelete(options.target, options.sqlBuilder)
            return await Hooks.afterDelete(
                options.target, options.sqlBuilder, await process.apply(
                    this, [options]
                )
            )
        }
    }

    // Privates ---------------------------------------------------------------
    private static async beforeFind<T extends Entity>(
        target: Constructor<T>,
        sqlBuilder: (
            FindByPkSQLBuilder<T> |
            FindOneSQLBuilder<T>
        )
    ) {
        if ((sqlBuilder as any).options) await HooksMetadata
            .find(target)
            ?.call('beforeFind', (sqlBuilder as any).options)
    }

    // ------------------------------------------------------------------------

    private static async afterFind<T extends Entity>(
        target: Constructor<T>,
        result: any
    ) {
        if (result) await HooksMetadata
            .find(target)
            ?.call('afterFind', result)

        return result
    }

    // ------------------------------------------------------------------------

    private static async beforeBulkFind<T extends Entity>(
        target: Constructor<T>,
        sqlBuilder: (
            FindSQLBuilder<T> |
            PaginationSQLBuilder<T>
        )
    ) {
        if ((sqlBuilder as any).options) await HooksMetadata
            .find(target)
            ?.call('beforeBulkFind', (sqlBuilder as any).options)
    }

    // ------------------------------------------------------------------------

    private static async afterBulkFind<T extends Entity>(
        target: Constructor<T>,
        result: any
    ) {
        if (result) await HooksMetadata
            .find(target)
            ?.call('afterBulkFind', result)

        return result
    }

    // ------------------------------------------------------------------------

    private static async beforeCreate<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: CreateSQLBuilder<T>
    ) {
        await HooksMetadata
            .find(target)
            ?.call(
                Array.isArray(sqlBuilder.attributes)
                    ? 'beforeBulkCreate'
                    : 'beforeCreate',
                sqlBuilder.attributes as any
            )
    }

    // ------------------------------------------------------------------------

    private static async afterCreate<T extends BaseEntity>(
        target: Constructor<T>,
        result: any
    ) {
        await HooksMetadata
            .find(target)
            ?.call(
                Array.isArray(result) ? 'afterBulkCreate' : 'afterCreate',
                result
            )

        return result
    }

    // ------------------------------------------------------------------------

    private static async beforeUpdate<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: UpdateSQLBuilder<T>
    ) {
        await HooksMetadata
            .find(target)
            ?.call(
                sqlBuilder._attributes instanceof EntityBase
                    ? 'beforeUpdate'
                    : 'beforeBulkUpdate',
                sqlBuilder._attributes as any,
                sqlBuilder.conditional
            )
    }

    // ------------------------------------------------------------------------

    private static afterUpdate<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: UpdateSQLBuilder<T>,
        result: T | ResultSetHeader,
    ) {
        (HooksMetadata.find(target)?.call as any)(...(() =>
            result instanceof EntityBase
                ? ['afterUpdate', result]
                : ['afterBulkUpdate', sqlBuilder.conditional, result]
        )())

        return result
    }

    // ------------------------------------------------------------------------

    private static async beforeDelete<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: DeleteSQLBuilder<T>
    ) {
        await HooksMetadata
            .find(target)
            ?.call(
                sqlBuilder.conditional instanceof EntityBase
                    ? 'beforeDelete'
                    : 'beforeBulkDelete',
                sqlBuilder.conditional as any
            )
    }

    // ------------------------------------------------------------------------

    private static async afterDelete<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: DeleteSQLBuilder<T>,
        result: DeleteResult,
    ) {
        (HooksMetadata.find(target)?.call as any)(...(() =>
            sqlBuilder.conditional instanceof EntityBase
                ? ['afterDelete', sqlBuilder.conditional]
                : ['afterBulkDelete', sqlBuilder.conditional, result]
        )())

        return result
    }
}