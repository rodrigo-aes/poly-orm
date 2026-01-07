export type HookType = (
    'beforeSync' |
    'afterSync' |
    'beforeFind' |
    'afterFind' |
    'beforeBulkFind' |
    'afterBulkFind' |
    'beforeCreate' |
    'afterCreate' |
    'beforeBulkCreate' |
    'afterBulkCreate' |
    'beforeUpdate' |
    'afterUpdate' |
    'beforeBulkUpdate' |
    'afterBulkUpdate' |
    'beforeDelete' |
    'afterDelete' |
    'beforeBulkDelete' |
    'afterBulkDelete'
)

export type HookFunction = (...args: any[]) => void | Promise<void>

export type HookMetadataJSON = {
    type: HookType
    method: string
    hookFn: HookFunction
}