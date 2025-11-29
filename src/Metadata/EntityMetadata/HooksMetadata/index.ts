import Metadata from "../../Metadata"

import HookMetadata, {
    BeforeSyncMetadata,
    AfterSyncMetadata,
    BeforeFindMetadata,
    AfterFindMetadata,
    BeforeBulkFindMetadata,
    AfterBulkFindMetadata,
    BeforeCreateMetadata,
    AfterCreateMetadata,
    BeforeBulkCreateMetadata,
    AfterBulkCreateMetadata,
    BeforeUpdateMetadata,
    AfterUpdateMetadata,
    BeforeBulkUpdateMetadata,
    AfterBulkUpdateMetadata,
    BeforeDeleteMetadata,
    AfterDeleteMetadata,
    BeforeBulkDeleteMetadata,
    AfterBulkDeleteMetadata,

    UpdatedTimestampMetadata,

    type HookMetadataJSON,
    type HookType
} from "./HookMetadata"

// Helpers
import { GeneralHelper } from "../../../Helpers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { Entity, Target, StaticTarget, } from "../../../types"

import type {
    RawData,
    MySQL2RawData
} from "../../../Handlers/MySQL2RawDataHandler"

import type {
    FindQueryOptions,
    CreationAttributes,
    UpdateAttributes,
    ConditionalQueryOptions
} from "../../../SQLBuilders"

import type { DeleteResult } from "../../../Handlers"
import type { HooksMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class HooksMetadata extends Metadata {
    private toCall: Set<HookType> = new Set

    public beforeSync: BeforeSyncMetadata[] = []
    public afterSync: AfterSyncMetadata[] = []
    public beforeFind: BeforeFindMetadata[] = []
    public afterFind: AfterFindMetadata[] = []
    public beforeBulkFind: BeforeBulkFindMetadata[] = []
    public afterBulkFind: AfterBulkFindMetadata[] = []
    public beforeCreate: BeforeCreateMetadata[] = []
    public afterCreate: AfterCreateMetadata[] = []
    public beforeBulkCreate: BeforeBulkCreateMetadata[] = []
    public afterBulkCreate: AfterBulkCreateMetadata[] = []
    public beforeUpdate: BeforeUpdateMetadata[] = []
    public afterUpdate: AfterUpdateMetadata[] = []
    public beforeBulkUpdate: BeforeBulkUpdateMetadata[] = []
    public afterBulkUpdate: AfterBulkUpdateMetadata[] = []
    public beforeDelete: BeforeDeleteMetadata[] = []
    public afterDelete: AfterDeleteMetadata[] = []
    public beforeBulkDelete: BeforeBulkDeleteMetadata[] = []
    public afterBulkDelete: AfterBulkDeleteMetadata[] = []

    constructor(public target: Target) {
        super()
        this.register()

        if ((this.target as StaticTarget).INHERIT_HOOKS) (
            this.mergeParentsHooks()
        )
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get KEY(): string {
        return 'hooks-metadata'
    }

    // Protecteds -------------------------------------------------------------
    protected static override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        throw new Error('HooksMetadata should be optional')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async callBeforeSync() {
        if (this.toCall.has('before-sync'))
            for (const hook of this.beforeSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callAfterSync() {
        if (this.toCall.has('after-sync'))
            for (const hook of this.afterSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callBeforeFind<Entity extends object>(
        options: FindQueryOptions<Entity>
    ) {
        if (this.toCall.has('before-find'))
            for (const hook of this.beforeFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterFind<
        T extends Entity | RawData<any> | MySQL2RawData
    >(entity: T) {
        if (this.toCall.has('after-find'))
            for (const hook of this.afterFind) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkFind<Entity extends object>(
        options: FindQueryOptions<Entity>
    ) {
        if (this.toCall.has('before-bulk-find'))
            for (const hook of this.beforeBulkFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkFind<
        T extends (
            Entity |
            RawData<any> |
            MySQL2RawData
        )
    >(
        entities: T[]
    ) {
        if (this.toCall.has('after-find'))
            for (const hook of this.afterBulkFind) await hook.call(entities)
    }

    // ------------------------------------------------------------------------

    public async callBeforeCreate<Entity extends object>(
        attributes: CreationAttributes<Entity>
    ) {
        if (this.toCall.has('before-create'))
            for (const hook of this.beforeCreate) await hook.call(attributes)
    }

    // ------------------------------------------------------------------------

    public async callAfterCreate<T extends Entity>(entity: T) {
        if (this.toCall.has('after-create'))
            for (const hook of this.afterCreate) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkCreate<Entity extends object>(
        attributes: CreationAttributes<Entity>[]
    ) {
        if (this.toCall.has('before-bulk-create'))
            for (const hook of this.beforeBulkCreate) (
                await hook.call(attributes)
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkCreate<
        T extends Entity | RawData<any> | MySQL2RawData
    >(result: T[]) {
        if (this.toCall.has('after-bulk-create'))
            for (const hook of this.afterBulkCreate) await hook.call(result)
    }

    // ------------------------------------------------------------------------

    public async callBeforeUpdate<T extends Entity>(
        attributes: T | UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) {
        if (this.toCall.has('before-update'))
            for (const hook of this.beforeUpdate) await hook.call(
                attributes,
                where
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterUpdate<Entity extends object>(entity: Entity) {
        if (this.toCall.has('after-update'))
            for (const hook of this.afterUpdate) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkUpdate<T extends Entity>(
        attributes: UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) {
        if (this.toCall.has('before-bulk-update'))
            for (const hook of this.beforeBulkUpdate) await hook.call(
                attributes,
                where
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkUpdate<T extends Entity>(
        where: ConditionalQueryOptions<T> | undefined,
        result: ResultSetHeader
    ) {
        if (this.toCall.has('after-bulk-update'))
            for (const hook of this.afterBulkUpdate) await hook.call(
                where,
                result
            )
    }

    // ------------------------------------------------------------------------

    public async callBeforeDelete<Entity extends object>(
        entity: Entity
    ) {
        if (this.toCall.has('before-delete'))
            for (const hook of this.beforeDelete) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callAfterDelete<Entity extends object>(
        entity: Entity,
        result: DeleteResult
    ) {
        if (this.toCall.has('after-delete'))
            for (const hook of this.afterDelete) await hook.call(
                entity,
                result
            )
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkDelete<Entity extends object>(
        where: ConditionalQueryOptions<Entity>
    ) {
        if (this.toCall.has('before-bulk-delete'))
            for (const hook of this.beforeBulkDelete) await hook.call(where)
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkDelete<Entity extends object>(
        where: ConditionalQueryOptions<Entity>,
        result: DeleteResult
    ) {
        if (this.toCall.has('after-bulk-delete'))
            for (const hook of this.afterBulkDelete) await hook.call(
                where,
                result
            )
    }

    // ------------------------------------------------------------------------

    public addBeforeSync(propertyName: string) {
        this.beforeSync.push(
            new HookMetadata.BeforeSync(this.target, propertyName)
        )

        this.toCall.add('before-sync')
    }

    // ------------------------------------------------------------------------

    public addAfterSync(propertyName: string) {
        this.afterSync.push(
            new HookMetadata.AfterSync(this.target, propertyName)
        )

        this.toCall.add('after-sync')
    }

    // ------------------------------------------------------------------------

    public addBeforeFind(propertyName: string) {
        this.beforeFind.push(
            new HookMetadata.BeforeFind(this.target, propertyName)
        )

        this.toCall.add('before-find')
    }

    // ------------------------------------------------------------------------

    public addAfterFind(propertyName: string) {
        this.afterFind.push(
            new HookMetadata.AfterFind(this.target, propertyName)
        )

        this.toCall.add('after-find')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkFind(propertyName: string) {
        this.beforeBulkFind.push(
            new HookMetadata.BeforeBulkFind(this.target, propertyName)
        )

        this.toCall.add('before-bulk-find')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkFind(propertyName: string) {
        this.afterBulkFind.push(
            new HookMetadata.AfterBulkFind(this.target, propertyName)
        )

        this.toCall.add('after-bulk-find')
    }

    // ------------------------------------------------------------------------

    public addBeforeCreate(propertyName: string) {
        this.beforeCreate.push(
            new HookMetadata.BeforeCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('before-create')
    }

    // ------------------------------------------------------------------------

    public addAfterCreate(propertyName: string) {
        this.afterCreate.push(
            new HookMetadata.AfterCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-create')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkCreate(propertyName: string) {
        this.beforeBulkCreate.push(
            new HookMetadata.BeforeBulkCreateMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('before-bulk-create')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkCreate(propertyName: string) {
        this.afterBulkCreate.push(
            new HookMetadata.AfterBulkCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-bulk-create')
    }

    // ------------------------------------------------------------------------

    public addBeforeUpdate(propertyName: string) {
        this.beforeUpdate.push(
            new HookMetadata.BeforeUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('before-update')
    }



    // ------------------------------------------------------------------------

    public addUpdatedTimestampMetadata() {
        this.beforeUpdate.push(new UpdatedTimestampMetadata(this.target))
        this.toCall.add('before-update')
    }

    // ------------------------------------------------------------------------

    public addAfterUpdate(propertyName: string) {
        this.afterUpdate.push(
            new HookMetadata.AfterUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-update')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkUpdate(propertyName: string) {
        this.beforeBulkUpdate.push(
            new HookMetadata.BeforeBulkUpdateMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('before-bulk-update')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkUpdate(propertyName: string) {
        this.afterBulkUpdate.push(
            new HookMetadata.AfterBulkUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('after-bulk-update')
    }

    // ------------------------------------------------------------------------

    public addBeforeDelete(propertyName: string) {
        this.beforeDelete.push(
            new HookMetadata.BeforeDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('before-delete')
    }

    // ------------------------------------------------------------------------

    public addAfterDelete(propertyName: string) {
        this.afterDelete.push(
            new HookMetadata.AfterDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('after-delete')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkDelete(propertyName: string) {
        this.beforeBulkDelete.push(
            new HookMetadata.BeforeBulkDeleteMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('before-bulk-delete')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkDelete(propertyName: string) {
        this.afterBulkDelete.push(
            new HookMetadata.AfterBulkDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('after-bulk-delete')
    }

    // ------------------------------------------------------------------------

    public toJSON(): HooksMetadataJSON {
        return {
            beforeSync: this.beforeSync.map(hook => hook.toJSON()),
            afterSync: this.afterSync.map(hook => hook.toJSON()),
            beforeFind: this.beforeFind.map(hook => hook.toJSON()),
            afterFind: this.afterFind.map(hook => hook.toJSON()),
            beforeBulkFind: this.beforeBulkFind.map(hook => hook.toJSON()),
            afterBulkFind: this.afterBulkFind.map(hook => hook.toJSON()),
            beforeCreate: this.beforeCreate.map(hook => hook.toJSON()),
            afterCreate: this.afterCreate.map(hook => hook.toJSON()),
            beforeBulkCreate: this.beforeBulkCreate.map(hook => hook.toJSON()),
            afterBulkCreate: this.afterBulkCreate.map(hook => hook.toJSON()),
            beforeUpdate: this.beforeUpdate.map(hook => hook.toJSON()),
            afterUpdate: this.afterUpdate.map(hook => hook.toJSON()),
            beforeBulkUpdate: this.beforeBulkUpdate.map(hook => hook.toJSON()),
            afterBulkUpdate: this.afterBulkUpdate.map(hook => hook.toJSON()),
            beforeDelete: this.beforeDelete.map(hook => hook.toJSON()),
            afterDelete: this.afterDelete.map(hook => hook.toJSON()),
            beforeBulkDelete: this.beforeBulkDelete.map(hook => hook.toJSON()),
            afterBulkDelete: this.afterBulkDelete.map(hook => hook.toJSON()),
        }
    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('hooks', this, this.target)
    }

    // ------------------------------------------------------------------------

    private mergeParentsHooks(): void {
        for (const parentHooks of GeneralHelper.objectParents(this.target)
            .flatMap(parent => HooksMetadata.find(parent) ?? [])
            .reverse()
        ) {
            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-sync') ?? true
            ) (
                this.beforeSync.push(...parentHooks.beforeSync)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-sync') ?? true
            ) (
                this.afterSync.push(...parentHooks.afterSync)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-find') ?? true
            ) (
                this.beforeFind.push(...parentHooks.beforeFind)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-find') ?? true
            ) (
                this.afterFind.push(...parentHooks.afterFind)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-bulk-find') ?? true
            ) (
                this.beforeBulkFind.push(...parentHooks.beforeBulkFind)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-bulk-find') ?? true
            ) (
                this.afterBulkFind.push(...parentHooks.afterBulkFind)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-create') ?? true
            ) (
                this.beforeCreate.push(...parentHooks.beforeCreate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-create') ?? true
            ) (
                this.afterCreate.push(...parentHooks.afterCreate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-bulk-create') ?? true
            ) (
                this.beforeBulkCreate.push(...parentHooks.beforeBulkCreate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-bulk-create') ?? true
            ) (
                this.afterBulkCreate.push(...parentHooks.afterBulkCreate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-update') ?? true
            ) (
                this.beforeUpdate.push(...parentHooks.beforeUpdate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-update') ?? true
            ) (
                this.afterUpdate.push(...parentHooks.afterUpdate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-bulk-update') ?? true
            ) (
                this.beforeBulkUpdate.push(...parentHooks.beforeBulkUpdate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-bulk-update') ?? true
            ) (
                this.afterBulkUpdate.push(...parentHooks.afterBulkUpdate)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-delete') ?? true
            ) (
                this.beforeDelete.push(...parentHooks.beforeDelete)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-delete') ?? true
            ) (
                this.afterDelete.push(...parentHooks.afterDelete)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('before-bulk-delete') ?? true
            ) (
                this.beforeBulkDelete.push(...parentHooks.beforeBulkDelete)
            )

            // ----------------------------------------------------------------

            if ((this.target as StaticTarget).INHERIT_ONLY_HOOKS
                ?.includes('after-bulk-delete') ?? true
            ) (
                this.afterBulkDelete.push(...parentHooks.afterBulkDelete)
            )
        }
    }
}

export {
    type HooksMetadataJSON,
    type HookMetadataJSON,
    type HookType
}