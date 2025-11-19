import { TriggerSchema } from "../../../../DatabaseSchema"


// Types
import type { PolyORMConnection } from "../../../../Metadata"
import type { BaseEntity } from "../../../../Entities"
import type { TriggerSyncAction } from "./types"

export default class TriggerSyncronizer<
    T extends BaseEntity = BaseEntity
> extends TriggerSchema<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: PolyORMConnection): Promise<void> {
        await this.drop(connection)
        await this.create(connection)
    }

    // ------------------------------------------------------------------------

    public async drop(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public async executeAction(
        connection: PolyORMConnection,
        schema?: TriggerSchema
    ): Promise<void> {
        const sql = this.compareActionSQL(schema)
        if (sql) await connection.query(sql)
    }

    // ------------------------------------------------------------------------

    public compareActionSQL(schema?: TriggerSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.alterSQL()
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: TriggerSchema): Omit<TriggerSyncAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // Privates ---------------------------------------------------------------
    private shouldAlter(schema: TriggerSchema): boolean {
        return (['event', 'action', 'timing', 'name'] as (
            (keyof TriggerSchema)[]
        ))
            .some(key => this[key] !== schema[key])
    }
}