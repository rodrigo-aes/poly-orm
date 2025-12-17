// Types
import type {
    PositionalArgsMap,
    PositionalArgConfig,
    PositionalArgument,
    Arg,
    PositionalArgPrefixConfig,

    OptionsMap,
    OptionConfig,
    OptionType,
    OptionValue,

} from "./types"

// Exceptions
import PolyORMException from "../Errors"

export default abstract class Command {
    public static readonly methods: string[] = []
    public static readonly description: string = ''

    private static readonly intPattern = /^-?\d+$/
    private static readonly floatPattern = (
        /^[ \t\n\r]*[+-]?(Infinity|(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)/
    )
    private static readonly literalPattern = /^<["'][^"']*["']>$/
    private static readonly extractEnumPattern = /([a-zA-Z_][a-zA-Z0-9_]*)/g
    private static readonly regexPattern = /^<\/(.+?)\/>$/

    private argsMap: PositionalArgsMap = {}
    private optsMap: OptionsMap = {}

    private handled: Set<string> = new Set
    private currentPosition: number = 0

    protected args: (PositionalArgument | string | number)[] = []
    protected opts: { [key: string]: any } = {}

    // Getters ================================================================
    private get proccessCommand(): string {
        return this.command + (this.method ? `:${this.method}` : '')
    }

    // ------------------------------------------------------------------------

    private get commandArgs(): [string, string][] {
        return Object.entries(process.argv
            .slice(2)
            .filter(arg =>
                arg !== this.proccessCommand &&
                !(arg.startsWith('--') || arg.startsWith('-'))
            )
        )
    }

    // ------------------------------------------------------------------------

    private get commandOpts(): [string, string][] {
        return Object.entries(process.argv
            .slice(2)
            .filter(arg =>
                arg !== this.proccessCommand &&
                arg.startsWith('--') || arg.startsWith('-')
            )
        )
    }

    // ------------------------------------------------------------------------

    private get requiredArgs(): PositionalArgConfig[] {
        return Object.values(this.argsMap).filter(({ required }) => required)
    }

    // ------------------------------------------------------------------------

    private get alreadyDefined(): boolean {
        return (
            Object.values(this.argsMap).length > 0 ||
            Object.values(this.optsMap).length > 0
        )
    }

    // Static Getters =========================================================
    // Privates ---------------------------------------------------------------
    private static get isInt(): Function {
        return this.regExpTest(this.intPattern)
    }

    // ------------------------------------------------------------------------

    private static get isFloat(): Function {
        return this.regExpTest(this.floatPattern)
    }

    // ------------------------------------------------------------------------

    constructor(protected command: string, protected method?: string) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract execute(): void | Promise<void>

    // ------------------------------------------------------------------------

    public parseCommand(): void {
        this.defineOnce()

        for (const [key, arg] of this.commandArgs) {
            if (this.handled.has(key)) continue
            this.handleArg(arg)
        }

        for (const [key, arg] of this.commandOpts) {
            if (this.handled.has(key)) continue
            this.handleOption(arg)
        }

        if (this.requiredArgs.length < this.args.length) (
            PolyORMException.CLI.throw(
                'INVALID_ARGS_NUMBER',
                this.requiredArgs.length,
                this.args.length
            )
        )
    }

    // ------------------------------------------------------------------------

    public argsHelp(commandLine: boolean = false): string | any[] {
        this.defineOnce()

        const args = Object.values(this.argsMap).map((
            { name, pattern, prefix, required, help }
        ) => {
            const req = required ? '' : '?'
            const id = prefix
                ? Command.buildPrefixId(prefix, pattern)
                : name
            const type = prefix ? id : Command.argTypeHelp(pattern)

            return commandLine ? `[${req}${id}]` : [
                `${name}:`,
                (type + (type ? ', ' : '') + help)
            ]
        })

        return commandLine ? args.join(' ') : args
    }

    // ------------------------------------------------------------------------

    public optsHelp(): any[] {
        this.defineOnce()

        return Object.entries(this.optsMap).map((
            [opt, { alias, type, defaultValue, help }]
        ) => {
            return [
                `${alias ? `-${alias}, ` : ''}--${opt}`,
                `<${type}>` +
                (defaultValue ? `, default: ${defaultValue}` : '') +
                (help ? `, ${help}` : '')
            ]
        })
    }

    // Protecteds -------------------------------------------------------------
    protected abstract define(): void

    // ------------------------------------------------------------------------

    protected arg(
        pattern: PositionalArgument,
        name: string,
        required: boolean = true,
        help?: string
    ) {
        let prefix: PositionalArgPrefixConfig | undefined = undefined

        if (typeof pattern === 'string' && pattern.includes(':')) {
            [pattern, prefix] = this.handlePrefixedArgPattern(pattern)
        }

        this.argsMap[parseInt(Object.keys(this.argsMap).pop() ?? '0') + 1] = {
            pattern,
            name,
            required,
            help,
            prefix
        }
    }

    // ------------------------------------------------------------------------

    protected option(
        name: string,
        type: OptionType = 'boolean',
        alias?: string,
        defaultValue?: OptionValue,
        help?: string,
    ) {
        this.optsMap[name] = {
            type,
            defaultValue,
            help,
            alias
        }
    }

    // Privates ---------------------------------------------------------------
    private defineOnce(): void {
        if (!this.alreadyDefined) this.define()
    }

    // ------------------------------------------------------------------------

    private handleArg(arg: string): void {
        const [position, pattern, value] = this.getArgConfig(arg)

        const index = position - 1
        const skiped = position > 1 ? index - this.args.length : 0

        this.args.splice(
            index,
            skiped > 0 ? 1 : 0,
            ...(skiped > 0 ? Array(skiped).fill(undefined) : []),
            this.parseArg(pattern, value)
        )
    }

    // ------------------------------------------------------------------------

    private handlePrefixedArgPattern(pattern: string): (
        [Arg, PositionalArgPrefixConfig]
    ) {
        const [prefix, patt] = pattern.split(':') as [string, Arg]

        return [patt, {
            name: prefix.replace(/[*?]/g, ''),
            required: prefix.endsWith('*') || !prefix.endsWith('?')
        }]
    }

    // ------------------------------------------------------------------------

    private parseArg(pattern: PositionalArgument, arg: string): (
        string | number
    ) {
        switch (typeof pattern) {
            case "object": if (pattern.test(arg)) return arg
                break

            // ----------------------------------------------------------------

            case "string": switch (pattern) {
                case '<?>': return arg

                // ------------------------------------------------------------

                case '<int>': if (Command.isInt(arg)) return parseInt(arg)
                    break

                // ------------------------------------------------------------

                case '<float>': if (Command.isFloat(arg)) return parseFloat(
                    arg
                )
                    break

                // ------------------------------------------------------------

                default: switch (true) {
                    case pattern.match(Command.literalPattern)?.[0] === arg:
                        return arg

                    // --------------------------------------------------------

                    case pattern.match(Command.extractEnumPattern)
                        ?.includes(arg): return arg

                    // --------------------------------------------------------

                    case Command.testRegExpPattern(pattern, arg): return arg
                }
            }
        }

        throw PolyORMException.CLI.instantiate('INVALID_ARG_VALUE', arg)
    }

    // ------------------------------------------------------------------------

    private handleOption(option: string): void {
        let [key, value] = option.replace(/^--?/, '').split('=') as (
            [string, any]
        )

        const config = this.getOptionConfig(key, option)

        if (config.type === 'boolean') {
            if (value) PolyORMException.CLI.throw(
                'INVALID_OPTION_VALUE', option, value
            )

            this.opts[key].value = true
            return
        }

        if (!value) value = this.nextArg(option)

        switch (config.type) {
            case "string":
                value.replace(/^(['"])(.*)\1$/, "$2")
                this.opts[key] = value
                break

            case "number":
                value = parseFloat(value)
                if (isNaN(value)) PolyORMException.CLI.throw(
                    'INVALID_OPTION_VALUE', option, value
                )

                this.opts[key] = value
                break
        }
    }

    // ------------------------------------------------------------------------

    private getArgConfig(arg: string): (
        [number, PositionalArgument, string]
    ) {
        if (arg.includes(':')) {
            const [prefix, value] = arg.split(':')

            const [position, config] = Object
                .entries(this.argsMap)
                .find(([_, config]) => config.prefix?.name === prefix)
                ?? (() => {
                    throw PolyORMException.CLI.instantiate(
                        'UNEXPECTED_NAMED_ARG', prefix
                    )
                })()

            return [parseInt(position), config.pattern, value]
        }

        this.currentPosition++
        const mapped = this.argsMap[this.currentPosition]
            ?? PolyORMException.CLI.throw('UNEXPECTED_POSITIONAL_ARG', arg)

        if (mapped.prefix?.required) throw new Error

        return [this.currentPosition, mapped.pattern, arg]
    }

    // ------------------------------------------------------------------------

    private getOptionConfig(key: string, raw: string): OptionConfig {
        return this.optsMap[key]
            ?? this.optsMap[(
                Object
                    .entries(this.optsMap)
                    .find(([_, value]) => value.alias === key)?.[0]
                ?? ''
            )]
            ?? PolyORMException.CLI.throw('UNKNOWN_OPTION', raw)
    }

    // ------------------------------------------------------------------------

    private nextArg(option: string): string {
        const next = process.argv.indexOf(option) + 1
        this.handled.add((next - 3).toString())
        return process.argv[next] ?? PolyORMException.CLI.throw(
            'MISSING_OPTION_VALUE', option
        )
    }

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static regExpTest(regExp: RegExp): Function {
        return regExp.test.bind(regExp)
    }

    // ------------------------------------------------------------------------

    private static testRegExpPattern(pattern: string, arg: string): boolean {
        const regexStr = pattern.match(Command.regexPattern)?.[0]
        return !!regexStr && new RegExp(regexStr).test(arg)
    }

    // ------------------------------------------------------------------------

    private static buildPrefixId(
        prefix: PositionalArgConfig['prefix'],
        pattern: PositionalArgument
    ) {
        return prefix!.name + (prefix!.required ? '' : '?') + `:` + pattern
    }

    // ------------------------------------------------------------------------

    private static argTypeHelp(pattern: PositionalArgument): string {
        switch (typeof pattern) {
            case "object": return '<?>'
            case "string": switch (pattern) {
                case '<?>':
                case '<int>':
                case '<float>': return pattern

                default:
                    let patt: any = pattern.match(Command.literalPattern)?.[0]
                    if (patt) return `"${patt}"`

                    patt = pattern.match(Command.extractEnumPattern)
                    if (patt) return `In: (${patt.join(' | ')})`

                    return '<?>'
            }
        }
    }
}