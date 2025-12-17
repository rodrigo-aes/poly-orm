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
            ?.callBeforeFind((sqlBuilder as any).options)
    }

    // ------------------------------------------------------------------------

    private static async afterFind<T extends Entity>(
        target: Constructor<T>,
        result: any
    ) {
        if (result) await HooksMetadata.find(target)?.callAfterFind(result)
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
            ?.callBeforeBulkFind((sqlBuilder as any).options)
    }

    // ------------------------------------------------------------------------

    private static async afterBulkFind<T extends Entity>(
        target: Constructor<T>,
        result: any
    ) {
        if (result) await HooksMetadata.find(target)?.callAfterBulkFind(result)
    }

    // ------------------------------------------------------------------------

    private static async beforeCreate<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: CreateSQLBuilder<T>
    ) {
        await HooksMetadata.find(target)?.[
            Array.isArray(sqlBuilder.attributes)
                ? 'callBeforeBulkCreate'
                : 'callBeforeCreate'
        ](sqlBuilder.attributes as any)
    }

    // ------------------------------------------------------------------------

    private static async afterCreate<T extends BaseEntity>(
        target: Constructor<T>,
        result: any
    ) {
        await (
            HooksMetadata.find(target)?.[Array.isArray(result)
                ? 'callAfterBulkCreate'
                : 'callAfterCreate'
            ] as any
        )(result)
    }

    // ------------------------------------------------------------------------

    private static async beforeUpdate<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: UpdateSQLBuilder<T>
    ) {
        await HooksMetadata.find(target)?.[
            sqlBuilder._attributes instanceof EntityBase
                ? 'callBeforeUpdate'
                : 'callBeforeBulkUpdate'
        ](
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
        return result instanceof EntityBase
            ? HooksMetadata.find(target)?.callAfterUpdate(result)
            : HooksMetadata.find(target)?.callAfterBulkUpdate(
                sqlBuilder.conditional, result
            )
    }

    // ------------------------------------------------------------------------

    private static async beforeDelete<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: DeleteSQLBuilder<T>
    ) {
        await HooksMetadata.find(target)?.[
            sqlBuilder.where instanceof EntityBase
                ? 'callBeforeDelete'
                : 'callBeforeBulkDelete'
        ](sqlBuilder.where as any)
    }

    // ------------------------------------------------------------------------

    private static async afterDelete<T extends BaseEntity>(
        target: Constructor<T>,
        sqlBuilder: DeleteSQLBuilder<T>,
        result: DeleteResult,
    ) {
        return HooksMetadata.find(target)?.[
            sqlBuilder.where instanceof EntityBase
                ? 'callAfterDelete'
                : 'callAfterBulkDelete'
        ](
            sqlBuilder.where as any,
            result
        )
    }
}