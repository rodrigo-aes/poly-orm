import { ConnectionsMetadata, type PolyORMConnection } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type {
    ProcedureArgsObject,
    ProcedureArgsSchema,
    ProcedureArgs,
    ProcedureOutResult,
    OptionalizeTuple
} from "./types"

// Exeptions
import PolyORMException from "../../Errors"

export default abstract class Procedure<
    Result extends any[] = any[],
    In extends ProcedureArgs = ProcedureArgs,
    Out extends ProcedureArgs = ProcedureArgs
> {
    private _conn!: PolyORMConnection

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.constructor.name
    }

    // Protecteds -------------------------------------------------------------
    protected get in(): ProcedureArgsSchema<In> | undefined {
        return undefined
    }

    // ------------------------------------------------------------------------

    protected get out(): ProcedureArgsSchema<Out> | undefined {
        return undefined
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public connection(connection: string | PolyORMConnection): this {
        this._conn = typeof connection === 'object'
            ? connection
            : ConnectionsMetadata.get(connection)

        return this
    }

    // ------------------------------------------------------------------------

    public async call(...args: OptionalizeTuple<In[1]>): (
        Promise<[
            Result,
            ProcedureOutResult<ProcedureArgsObject<Out[0], Out[1]>>
        ]>
    ) {
        const [result, [out]] = await this._conn.query(
            this.callSQL(...args)
        )

        return [result, out]
    }

    // ------------------------------------------------------------------------

    public async register(): Promise<void> {
        await this._conn.query(this.dropIfExistsSQL())
        await this._conn.query(this.registerSQL())
    }

    // ------------------------------------------------------------------------

    public registerSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE PROCEDURE ${this.name} (${this.defineArgsSQL()})
            BEGIN ${this.proccessSQL()} END;
        `)
    }

    // ------------------------------------------------------------------------

    public callSQL(...args: In[1]): string {
        return SQLStringHelper.normalizeSQL(`
            CALL ${this.name} (${this.callArgsSQL(...args)});
            ${this.out ? `SELECT ${this.callOutArgsSQL().join(', ')}` : ''}    
        `)
    }

    // Protecteds -------------------------------------------------------------
    protected abstract proccessSQL(): string

    // ------------------------------------------------------------------------

    /** @internal */
    protected callInArgsSQL(...args: In[1]): string[] {
        return args.map(arg => PropertySQLHelper.valueSQL(arg))
    }

    // Privates ---------------------------------------------------------------
    private dropIfExistsSQL(): string {
        return `DROP PROCEDURE IF EXISTS ${this.name}`
    }

    // ------------------------------------------------------------------------

    private defineArgsSQL(): string {
        return this.defineInArgsSQL()
            .concat(
                this.defineOutArgsSQL()
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private defineInArgsSQL(): string[] {
        return this.in
            ? Object.entries(this.in).map(
                ([name, dataType]) => `IN ${name} ${dataType.buildSQL()}`
            )
            : []

    }

    // ------------------------------------------------------------------------

    private defineOutArgsSQL(): string[] {
        return this.out
            ? Object.entries(this.out).map(
                ([name, dataType]) => `OUT ${name} ${dataType.buildSQL()}`
            )
            : []
    }

    // ------------------------------------------------------------------------

    private callArgsSQL(...args: In[1]): string {
        return this.callInArgsSQL(...args)
            .concat(
                this.callOutArgsSQL()
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private callOutArgsSQL(): string[] {
        return this.out
            ? Object.keys(this.out).map(name => `@${name}`)
            : []
    }
}