import Command from "../Command"

// Config
import Config from "../../Config"

// Metadata
import { ConnectionsMetadata } from "../../Metadata"

// Migrator
import Migrator from "../../Migrator"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { MigrationCommanderMethod } from "./types"
import type { ActionType } from "../../DatabaseSchema"

// Exceptions
import PolyORMException from "../../Errors"

export default class MigrationCommand extends Command {
    public static override readonly methods: MigrationCommanderMethod[] = [
        'init',
        'run',
        'back',
        'reset',
        'sync',
        'register',
        'create',
        'delete',
        'move'
    ]

    public static override description: string = 'Manage migrations'

    constructor(
        protected command: string,
        protected method?: MigrationCommanderMethod
    ) {
        super(command, method)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public execute(): Promise<void> {
        console.log(this.method)
        switch (this.method) {
            case 'init':
            case 'run':
            case 'back':
            case 'reset':
            case 'register':
            case 'sync': return this.executeMethod()
            case 'create': return this.executeCreate()
            case 'delete': return this.executeDelete()
            case 'move': return this.executeMove()

            default: throw new Error
        }
    }

    // Protecteds -------------------------------------------------------------
    protected define(): void {
        this.connectionsDefine()

        switch (this.method) {
            case 'create': this.createDefine()
                break

            case 'delete': this.deleteDefine()
                break

            case 'move': this.moveDefine()
                break
        }
    }

    // Privates ---------------------------------------------------------------
    private async getConnections(): Promise<PolyORMConnection[]> {
        await Config.createConnections()

        if (this.opts.connections) return this.opts.connnection
            .split(',')
            .map((name: string) => ConnectionsMetadata.getOrThrow(
                name.trim()
            ))

        return ConnectionsMetadata.all()
    }

    // ------------------------------------------------------------------------

    private connectionsDefine(): void {
        this.option(
            'connections',
            'string',
            'c',
            undefined,
            'Connections folders to include separated by ","'
        )
    }

    // ------------------------------------------------------------------------

    private createDefine(): void {
        this.arg('<(create|alter|drop)>', 'action', true,
            'Migration table action'
        )
        this.arg('<?>', 'table', true, 'Table name')
        this.option('name', 'string', 'n', undefined, 'Migration name')
        this.option(
            'at-position', 'number', 'at', undefined, 'At position to insert'
        )
    }

    // ------------------------------------------------------------------------

    private deleteDefine(): void {
        this.arg(
            '<?>', 'migration', true, 'Migration name, file name or position'
        )
    }

    // ------------------------------------------------------------------------

    private moveDefine(): void {
        this.arg('from?:<int>', 'from', true, 'Origin position')
        this.arg('to?:<int>', 'to', true, 'Destination position')
    }

    // ------------------------------------------------------------------------

    private async executeMethod(): Promise<void> {
        console.log(this.method)
        for (const connection of await this.getConnections()) {
            console.log(this.method)
            console.log(new Migrator(connection)[this.method as (
                'init' | 'run' | 'back' | 'reset' | 'sync' | 'register'
            )])

            await new Migrator(connection)[this.method as (
                'init' | 'run' | 'back' | 'reset' | 'sync' | 'register'
            )]()

            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeCreate(): Promise<void> {
        const [action, tableName] = this.args as [
            string | undefined,
            string | undefined
        ]

        if (!action) throw new Error
        if (!tableName) throw new Error

        const { name, atOrder } = this.opts

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).create(
                action.toUpperCase() as ActionType,
                tableName as string,
                name,
                atOrder
            )

            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeDelete(): Promise<void> {
        const [id] = this.args as [string | number | undefined]
        if (!id) throw new Error

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).delete(id)
            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeMove(): Promise<void> {
        const [from, to] = this.args as ([
            number | undefined,
            number | undefined
        ])

        if (!from) throw new Error
        if (!to) throw new Error

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).move(from, to)
            await connection.close()
        }
    }
}