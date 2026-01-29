import type { Constructor } from "../../../types"
import type DatabaseSchema from "../../../DatabaseSchema"
import type { TableSchema, ActionType } from "../../../DatabaseSchema"
import type DatabaseMigrator from "../../DatabaseMigrator"
import type Migration from "../../Migration"
import type { MigrationRunMethod } from "../../types"
import type { MigrationData } from "../../MigrationsTableHandler"
import type {
    CreateMigrationFileProps,
    SyncMigrationFileProps
} from "../../MigrationFileHandler"


// METHOD NAMEs ==============================================================
export type MainProcessMethod = MigrationRunMethod | 'reset'
export type ChildProccessMethod = 'runMigration' | 'backMigration'
export type SQLTableOperationMethod = (
    'create' | 'alter' | 'drop' | 'createAll' | 'dropAll'
)
export type CreateMigrationFileMethod = 'create' | 'sync'

// THIS ARGs===================================================================
export type SQLTableOperationThisArg<
    Method extends string
> = (
        Method extends 'create' | 'alter' | 'drop'
        ? TableSchema
        : Method extends 'createAll' | 'dropAll'
        ? DatabaseSchema
        : never
    )

// ARGS =======================================================================
export type ChildProccessArgs<Method extends ChildProccessMethod> = (
    Method extends 'runMigration'
    ? [DatabaseMigrator, Constructor<Migration>, number]
    : Method extends 'backMigration'
    ? [DatabaseMigrator, Constructor<Migration>]
    : never
)

// ----------------------------------------------------------------------------

export type CreateMigrationFileArgs<
    Method extends CreateMigrationFileMethod
> = (
        Method extends 'create'
        ? CreateMigrationFileProps
        : Method extends 'sync'
        ? SyncMigrationFileProps
        : never
    )

// DESCRIPTORS ================================================================
export type DefaultVoidDescriptor = TypedPropertyDescriptor<
    (...args: any[]) => Promise<void>
>

// ----------------------------------------------------------------------------

export type ChildProccessDescriptor<Method extends ChildProccessMethod> = (
    TypedPropertyDescriptor<
        (...args: ChildProccessArgs<Method>) => Promise<void>
    >
)

// ----------------------------------------------------------------------------

export type CreateMigrationDescriptor = TypedPropertyDescriptor<
    (
        action: ActionType,
        tableName: string,
        className?: string,
        at?: number
    ) => Promise<void>
>

// ----------------------------------------------------------------------------

export type DeleteMigrationDescriptor = TypedPropertyDescriptor<
    (id: string | number) => Promise<void>
>

// ----------------------------------------------------------------------------

export type MoveMigrationDescriptor = TypedPropertyDescriptor<
    (from: number, to: number) => Promise<void>
>

// ----------------------------------------------------------------------------

export type InsertMigrationDescriptor = TypedPropertyDescriptor<
    (name: string, ...args: any[]) => Promise<[MigrationData, MigrationData[]]>
>

// ----------------------------------------------------------------------------

export type EraseMigrationDescriptor = TypedPropertyDescriptor<
    (id: string | number) => Promise<number>
>

// ----------------------------------------------------------------------------

export type CreateMigrationFileDescriptor<
    Method extends CreateMigrationFileMethod
> = TypedPropertyDescriptor<
    (
        dir: string,
        action: ActionType,
        properties: CreateMigrationFileArgs<Method>
    ) => void
>

// ----------------------------------------------------------------------------

export type DeleteMigrationFileDescriptor = TypedPropertyDescriptor<
    (deleted: number) => void
>


// ----------------------------------------------------------------------------

export type IncludedDescriptor = TypedPropertyDescriptor<
    (method: MigrationRunMethod) => Promise<string[]>
>

// ----------------------------------------------------------------------------

export type UnknownMigrationFilesDescriptor = TypedPropertyDescriptor<
    (silent: boolean) => Promise<string[]>
>