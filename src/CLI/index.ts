// Commands
import Command from './Command'
import MigrationCommander from './MigrationCommander'

// Types
import type { Constructor } from '../types'
import type { CommandConstructor, CommandMap } from "./types"

// Exceptions
import PolyORMException from '../Errors'

export default class CLI {
    constructor(private commands: CommandMap) {
        this.execute()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get shouldHelp(): boolean {
        return process.argv.includes('-h') || process.argv.includes('--help')
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private async execute(): Promise<void> {
        const [command, method] = process.argv
            .slice(2)
            .find(arg => !(arg.startsWith('-') || arg.startsWith('--')))
            ?.split(':')
            ?? []

        if (this.shouldHelp) return this.help(command, method)

        const proccess = this.instantiate(command, method)
        proccess.parseCommand()
        await proccess.execute()
    }

    // ------------------------------------------------------------------------

    private instantiate(command: string, method?: string): Command {
        const Command = this.verifyCommand(command)
        this.verifyMethod(Command, command, method)

        return new (Command as Constructor<Command>)(command, method)
    }

    // ------------------------------------------------------------------------

    private verifyCommand(command: string): CommandConstructor {
        return this.commands[command] ?? PolyORMException.CLI.throw(
            'UNKNOWN_COMMAND', command
        )
    }

    // ------------------------------------------------------------------------

    private verifyMethod(
        constructor: CommandConstructor,
        command: string,
        method?: string
    ): void {
        if (method && !constructor.methods.includes(method)) (
            PolyORMException.CLI.throw('UNKNOWN_METHOD', command, method)
        )
    }

    // ------------------------------------------------------------------------

    private help(command?: string, method?: string) {
        this.verifyHelp(command, method)

        if (command) this.handleInterfaceComponent(
            this.detailedCommandHelp(
                this.verifyCommand(command),
                command,
                method
            ),
            this.getMaxColums() + 8
        )

        else for (const component of this.helpInterface()) (
            this.handleInterfaceComponent(component, this.getMaxColums() + 8)
        )
    }

    // ------------------------------------------------------------------------

    private verifyHelp(command?: string, method?: string): void {
        if (process.argv.slice(2).some(arg => ![
            '-h',
            '--help',
            '--detailed',
            ...(command ? [`${command}${method ? `:${method}` : ''}`] : [])
        ]
            .includes(arg)
        )) PolyORMException.CLI.throw('USING_HELP_ON_COMMAND_EXECUTION')
    }

    // ------------------------------------------------------------------------

    private getMaxColums(components: any[] = this.helpInterface()): number {
        let max = 0
        for (const component of components)
            if (
                typeof component === 'string' &&
                components.some(comp => Array.isArray(comp))
            ) {
                if (component.length > max) max = component.length
            }
            else if (Array.isArray(component)) {
                const childMax = this.getMaxColums(component)
                if (childMax > max) max = childMax
            }

        return max
    }

    // ------------------------------------------------------------------------

    private handleInterfaceComponent(
        component: string | any[],
        maxColumns: number,
        pad: number = 2,
    ): void {
        if (typeof component === 'string') console.log(component)
        else console.log(this.handleComponentArray(component, maxColumns, pad))
    }

    // ------------------------------------------------------------------------

    private handleComponentArray(
        component: any[],
        maxColumns: number,
        pad: number,
    ): string {
        return component.map(comp => {
            switch (typeof comp) {
                case 'string': return (' '.repeat(pad) + comp).padEnd(
                    maxColumns - pad
                )

                case 'object': return (
                    (
                        (comp as any[]).some(c => typeof c === 'string')
                            ? '\n'
                            : ''
                    ) + this.handleComponentArray(
                        comp,
                        maxColumns,
                        pad + (
                            component.some(
                                (c: string | any[]) => typeof c === 'string'
                            )
                                ? 2
                                : 0
                        ),

                    )
                )
            }
        })
            .join('')
    }

    // ------------------------------------------------------------------------

    private helpInterface() {
        return [
            '\n',
            'Usage: poly-cli [command] [...options]',
            '\nOptions:',
            ['-h, --help:', 'display help for command'],
            '\nCommands:',
            this.commandsHelp(),
        ]
    }

    // ------------------------------------------------------------------------

    private commandsHelp(): any[] {
        return Object.entries(this.commands)
            .flatMap(([command, constructor]) => [
                `${command}:`,
                constructor.description,
                [`Example:`, `poly-cli ${command}:[?method] [...options]`],
                [
                    'Methods:',
                    process.argv.includes('--detailed')
                        ? this.detailedCommandsHelp(constructor, command)
                        : constructor.methods.map(method => method).join(', ')
                ]
            ])
    }

    // ------------------------------------------------------------------------

    private detailedCommandsHelp(
        constructor: CommandConstructor,
        command: string,
    ): any[] {
        return constructor.methods.map(method => [
            `${method}:`,
            this.detailedCommandHelp(constructor, command, method),
            '\n'
        ])
    }

    // ------------------------------------------------------------------------

    private detailedCommandHelp(
        constructor: CommandConstructor,
        command: string,
        method?: string
    ): any[] {
        const instance = new (constructor as Constructor<Command>)(
            command,
            method
        )

        const argsLine = instance.argsHelp(true)
        const argsHelp = instance.argsHelp(false) as any[]
        const optsHelp = instance.optsHelp()

        return [
            ['Usage:', `poly-cli ${command}:${method} ` + argsLine],
            argsHelp.length > 0 ? ['Args:', argsHelp] : [],
            optsHelp.length > 0 ? ['Options:', optsHelp] : [],
        ]
    }
}


export {
    MigrationCommander
}