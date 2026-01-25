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

    type HookMetadataJSON,
    type HookType
} from "./HookMetadata"

// Helpers
import { GeneralHelper } from "../../../Helpers"

// Types
import type { Target, StaticTarget, } from "../../../types"
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
    public async call(name: HookType, ...args: any[]): Promise<void> {
        if (this.toCall.has(name)) for (const hook of this[name]) (
            await (hook as any).call(...args)
        )
    }

    // ------------------------------------------------------------------------

    public add(name: HookType, propertyName: string) {
        this[name].push(
            new (HookMetadata[(
                name.charAt(0).toUpperCase() + name.slice(1) as (
                    keyof typeof HookMetadata
                )
            )] as any)(this.target, propertyName)
        )

        this.toCall.add(name)
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
            afterBulkDelete: this.afterBulkDelete.map(hook => hook.toJSON())
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