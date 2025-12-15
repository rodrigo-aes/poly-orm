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
        T extends FindByPkOperation<any, any> | FindOneOperation<any, any>
    >(
        _: T,
        __: string,
        descriptor: TypedPropertyDescriptor<() => Promise<any>>
    ) {
        const process = descriptor.value!

        descriptor.value = async function (this: T) {
            await Hooks.beforeFind(this.target, this.sqlBuilder)
            return await Hooks.afterFind(
                this.target, await process.apply(this)
            )
        }
    }

    // ------------------------------------------------------------------------

    public static BulkFind<
        T extends FindOperation<any, any> | PaginateOperation<any>
    >(
        _: T,
        __: string,
        descriptor: TypedPropertyDescriptor<() => Promise<any>>
    ) {
        const process = descriptor.value!

        descriptor.value = async function (this: T) {
            await Hooks.beforeBulkFind(this.target, this.sqlBuilder)
            return await Hooks.afterBulkFind(
                this.target, await process.apply(this)
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Create(
        _: CreateOperation<any, any>,
        __: string,
        descriptor: TypedPropertyDescriptor<() => Promise<any>>
    ) {
        const process = descriptor.value!

        descriptor.value = async function (this: CreateOperation<any, any>) {
            await Hooks.beforeCreate(this.target, this.sqlBuilder)
            return await Hooks.afterCreate(
                this.target, await process.apply(this)
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Update(
        _: UpdateOperation<any, any>,
        __: string,
        descriptor: TypedPropertyDescriptor<() => Promise<any>>
    ) {
        const process = descriptor.value!

        descriptor.value = async function (this: UpdateOperation<any, any>) {
            await Hooks.beforeUpdate(this.target, this.sqlBuilder)
            return await Hooks.afterUpdate(
                this.target, this.sqlBuilder, await process.apply(this)
            )
        }
    }

    // ------------------------------------------------------------------------

    public static Delete(
        _: DeleteOperation<any>,
        __: string,
        descriptor: TypedPropertyDescriptor<() => Promise<any>>
    ) {
        const process = descriptor.value!

        descriptor.value = async function (this: DeleteOperation<any>) {
            await Hooks.beforeDelete(this.target, this.sqlBuilder)
            return await Hooks.afterDelete(
                this.target, this.sqlBuilder, await process.apply(this)
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