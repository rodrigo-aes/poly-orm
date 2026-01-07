export default class ModuleHelper {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static indent(line: string, spaces: number = 4): string {
        return line
            .split('\n')
            .map(line => ' '.repeat(spaces) + line)
            .join('\n');
    }

    // ------------------------------------------------------------------------

    public static indentMany(
        parts: (string | [string, number | undefined])[]
    ): string {
        return parts
            .filter(part => typeof part === 'string'
                ? !!part.trim()
                : !!part[0].trim()
            )
            .map(part => {
                if (typeof part === 'string') return this.handleLine(part)

                const [line, spaces] = part
                return spaces
                    ? this.indent(this.handleLine(line), spaces)
                    : this.handleLine(line)
            })
            .join('\n')
    }

    // ------------------------------------------------------------------------

    public static toPascalCase(...parts: string[]): string {
        return parts
            .flatMap(part => part.match(/[A-Z]?[a-z_]+|[0-9_]+/g) ?? [])
            .map(part =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join('')
    }

    // Privates ---------------------------------------------------------------
    private static handleLine(line: string): string {
        switch (line) {
            case '#[break]': return ''
            default: return line
        }
    }
}