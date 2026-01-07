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

        if ((this.target as StaticTarget).INHERIT_HOOKS) this.mergeParents()
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
        if (this.toCall.has('beforeSync'))
            for (const hook of this.beforeSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callAfterSync() {
        if (this.toCall.has('afterSync'))
            for (const hook of this.afterSync) await hook.call()
    }

    // ------------------------------------------------------------------------

    public async callBeforeFind<T extends Entity>(
        options: FindQueryOptions<T>
    ) {
        if (this.toCall.has('beforeFind'))
            for (const hook of this.beforeFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterFind(entity: any) {
        if (this.toCall.has('afterFind'))
            for (const hook of this.afterFind) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkFind<T extends Entity>(
        options: FindQueryOptions<T>
    ) {
        if (this.toCall.has('beforeBulkFind'))
            for (const hook of this.beforeBulkFind) await hook.call(options)
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkFind(entities: any[]) {
        if (this.toCall.has('afterBulkFind'))
            for (const hook of this.afterBulkFind) await hook.call(entities)
    }

    // ------------------------------------------------------------------------

    public async callBeforeCreate<T extends Entity>(
        attributes: CreationAttributes<T>
    ) {
        if (this.toCall.has('beforeCreate'))
            for (const hook of this.beforeCreate) await hook.call(attributes)
    }

    // ------------------------------------------------------------------------

    public async callAfterCreate<T extends Entity>(entity: T) {
        if (this.toCall.has('afterCreate'))
            for (const hook of this.afterCreate) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkCreate<T extends Entity>(
        attributes: CreationAttributes<T>[]
    ) {
        if (this.toCall.has('beforeBulkCreate'))
            for (const hook of this.beforeBulkCreate) (
                await hook.call(attributes)
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkCreate(result: any[]) {
        if (this.toCall.has('afterBulkCreate'))
            for (const hook of this.afterBulkCreate) await hook.call(result)
    }

    // ------------------------------------------------------------------------

    public async callBeforeUpdate<T extends Entity>(
        attributes: T | UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) {
        if (this.toCall.has('beforeUpdate'))
            for (const hook of this.beforeUpdate) await hook.call(
                attributes,
                where
            )
    }

    // ------------------------------------------------------------------------

    public async callAfterUpdate<T extends Entity>(entity: T) {
        if (this.toCall.has('afterUpdate'))
            for (const hook of this.afterUpdate) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkUpdate<T extends Entity>(
        attributes: UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) {
        if (this.toCall.has('beforeBulkUpdate'))
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
        if (this.toCall.has('afterBulkUpdate'))
            for (const hook of this.afterBulkUpdate) await hook.call(
                where,
                result
            )
    }

    // ------------------------------------------------------------------------

    public async callBeforeDelete<T extends Entity>(
        entity: T
    ) {
        if (this.toCall.has('beforeDelete'))
            for (const hook of this.beforeDelete) await hook.call(entity)
    }

    // ------------------------------------------------------------------------

    public async callAfterDelete<T extends Entity>(
        entity: T,
        result: DeleteResult
    ) {
        if (this.toCall.has('afterDelete'))
            for (const hook of this.afterDelete) await hook.call(
                entity,
                result
            )
    }

    // ------------------------------------------------------------------------

    public async callBeforeBulkDelete<T extends Entity>(
        where: ConditionalQueryOptions<T>
    ) {
        if (this.toCall.has('beforeBulkDelete'))
            for (const hook of this.beforeBulkDelete) await hook.call(where)
    }

    // ------------------------------------------------------------------------

    public async callAfterBulkDelete<T extends Entity>(
        where: ConditionalQueryOptions<T>,
        result: DeleteResult
    ) {
        if (this.toCall.has('afterBulkDelete'))
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

        this.toCall.add('beforeSync')
    }

    // ------------------------------------------------------------------------

    public addAfterSync(propertyName: string) {
        this.afterSync.push(
            new HookMetadata.AfterSync(this.target, propertyName)
        )

        this.toCall.add('afterSync')
    }

    // ------------------------------------------------------------------------

    public addBeforeFind(propertyName: string) {
        this.beforeFind.push(
            new HookMetadata.BeforeFind(this.target, propertyName)
        )

        this.toCall.add('beforeFind')
    }

    // ------------------------------------------------------------------------

    public addAfterFind(propertyName: string) {
        this.afterFind.push(
            new HookMetadata.AfterFind(this.target, propertyName)
        )

        this.toCall.add('afterFind')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkFind(propertyName: string) {
        this.beforeBulkFind.push(
            new HookMetadata.BeforeBulkFind(this.target, propertyName)
        )

        this.toCall.add('beforeBulkFind')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkFind(propertyName: string) {
        this.afterBulkFind.push(
            new HookMetadata.AfterBulkFind(this.target, propertyName)
        )

        this.toCall.add('afterBulkFind')
    }

    // ------------------------------------------------------------------------

    public addBeforeCreate(propertyName: string) {
        this.beforeCreate.push(
            new HookMetadata.BeforeCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('beforeCreate')
    }

    // ------------------------------------------------------------------------

    public addAfterCreate(propertyName: string) {
        this.afterCreate.push(
            new HookMetadata.AfterCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('afterCreate')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkCreate(propertyName: string) {
        this.beforeBulkCreate.push(
            new HookMetadata.BeforeBulkCreateMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('beforeBulkCreate')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkCreate(propertyName: string) {
        this.afterBulkCreate.push(
            new HookMetadata.AfterBulkCreateMetadata(this.target, propertyName)
        )

        this.toCall.add('afterBulkCreate')
    }

    // ------------------------------------------------------------------------

    public addBeforeUpdate(propertyName: string) {
        this.beforeUpdate.push(
            new HookMetadata.BeforeUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('beforeUpdate')
    }



    // ------------------------------------------------------------------------

    public addUpdatedTimestampMetadata() {
        this.beforeUpdate.push(new UpdatedTimestampMetadata(this.target))
        this.toCall.add('beforeUpdate')
    }

    // ------------------------------------------------------------------------

    public addAfterUpdate(propertyName: string) {
        this.afterUpdate.push(
            new HookMetadata.AfterUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('afterUpdate')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkUpdate(propertyName: string) {
        this.beforeBulkUpdate.push(
            new HookMetadata.BeforeBulkUpdateMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('beforeBulkUpdate')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkUpdate(propertyName: string) {
        this.afterBulkUpdate.push(
            new HookMetadata.AfterBulkUpdateMetadata(this.target, propertyName)
        )

        this.toCall.add('afterBulkUpdate')
    }

    // ------------------------------------------------------------------------

    public addBeforeDelete(propertyName: string) {
        this.beforeDelete.push(
            new HookMetadata.BeforeDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('beforeDelete')
    }

    // ------------------------------------------------------------------------

    public addAfterDelete(propertyName: string) {
        this.afterDelete.push(
            new HookMetadata.AfterDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('afterDelete')
    }

    // ------------------------------------------------------------------------

    public addBeforeBulkDelete(propertyName: string) {
        this.beforeBulkDelete.push(
            new HookMetadata.BeforeBulkDeleteMetadata(
                this.target, propertyName
            )
        )

        this.toCall.add('beforeBulkDelete')
    }

    // ------------------------------------------------------------------------

    public addAfterBulkDelete(propertyName: string) {
        this.afterBulkDelete.push(
            new HookMetadata.AfterBulkDeleteMetadata(this.target, propertyName)
        )

        this.toCall.add('afterBulkDelete')
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

    private mergeParents(): void {
        for (const parentHooks of GeneralHelper.objectParents(this.target)
            .flatMap(parent => HooksMetadata.find(parent) ?? [])
            .reverse()
        )
            for (const inherit of
                (this.target as StaticTarget).INHERIT_ONLY_HOOKS ?? []
            ) (
                this[inherit].push(...parentHooks[inherit] as any)
            )
    }
}

export {
    type HooksMetadataJSON,
    type HookMetadataJSON,
    type HookType
}