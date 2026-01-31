import type { MigrationRunMethod } from "../../types"

// METHOD NAMEs ==============================================================
export type MainProcessMethod = MigrationRunMethod | 'reset'
export type ChildProccessMethod = 'runMigration' | 'backMigration'
export type SQLTableOperationMethod = (
    'create' | 'alter' | 'drop' | 'createAll' | 'dropAll'
)