import type { PoolOptions } from "mysql2"
import type { EntityTarget } from "../types"

export interface MySQLConnectionInstance {
    type: 'MySQL'

    name: string
    entities: EntityTarget[]

    query<T = any>(sql: string, params?: any[]): Promise<T[]>
    close(): Promise<void>
    sync(mode: 'alter' | 'reset'): Promise<void>
}

export interface MySQLConnectionConfig extends PoolOptions {
    host: string
    port: number
    user: string
    database: string
    entities?: EntityTarget[]
    logging?: LogginOptions
    sync?: boolean
}

export type MySQLConnection = MySQLConnectionInstance & {
    [K in keyof MySQLConnectionConfig]: MySQLConnectionConfig[K]
}

export type LogginConfig = {
    sql?: boolean
}

export type LogginOptions = boolean | LogginConfig

export type QueryOptions = {
    logging: LogginOptions
}