import AbstractHookMetadata from "./HookMetadata"

import BeforeSyncMetadata from "./BeforeSyncMetadata"
import AfterSyncMetadata from "./AfterSyncMetadata"
import BeforeFindMetadata from "./BeforeFindMetadata"
import AfterFindMetadata from "./AfterFindMetadata"
import BeforeBulkFindMetadata from "./BeforeBulkFindMetadata"
import AfterBulkFindMetadata from "./AfterBulkFindMetadata"
import BeforeCreateMetadata from "./BeforeCreateMetadata"
import AfterCreateMetadata from "./AfterCreateMetadata"
import BeforeBulkCreateMetadata from "./BeforeBulkCreateMetadata"
import AfterBulkCreateMetadata from "./AfterBulkCreateMetadata"
import BeforeUpdateMetadata from "./BeforeUpdateMetadata"
import AfterUpdateMetadata from "./AfterUpdateMetadata"
import BeforeBulkUpdateMetadata from "./BeforeBulkUpdateMetadata"
import AfterBulkUpdateMetadata from "./AfterBulkUpdateMetadata"
import BeforeDeleteMetadata from "./BeforeDeleteMetadata"
import AfterDeleteMetadata from "./AfterDeleteMetadata"
import BeforeBulkDeleteMetadata from "./BeforeBulkDeleteMetadata"
import AfterBulkDeleteMetadata from "./AfterBulkDeleteMetadata"

import UpdatedTimestampMetadata from "./UpdatedTimestampMetadata"

// Types
import type { HookMetadataJSON, HookType, InternalHookType } from "./types"

export default abstract class HookMetadata extends AbstractHookMetadata {
    public static BeforeSync = BeforeSyncMetadata
    public static AfterSync = AfterSyncMetadata
    public static BeforeFind = BeforeFindMetadata
    public static AfterFind = AfterFindMetadata
    public static BeforeBulkFind = BeforeBulkFindMetadata
    public static AfterBulkFind = AfterBulkFindMetadata
    public static BeforeCreate = BeforeCreateMetadata
    public static AfterCreate = AfterCreateMetadata
    public static BeforeBulkCreate = BeforeBulkCreateMetadata
    public static AfterBulkCreate = AfterBulkCreateMetadata
    public static BeforeUpdate = BeforeUpdateMetadata
    public static AfterUpdate = AfterUpdateMetadata
    public static BeforeBulkUpdate = BeforeBulkUpdateMetadata
    public static AfterBulkUpdate = AfterBulkUpdateMetadata
    public static BeforeDelete = BeforeDeleteMetadata
    public static AfterDelete = AfterDeleteMetadata
    public static BeforeBulkDelete = BeforeBulkDeleteMetadata
    public static AfterBulkDelete = AfterBulkDeleteMetadata

    public static UpdatedTimestamp = UpdatedTimestampMetadata
}

export {
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
    type HookType,
    type InternalHookType
}