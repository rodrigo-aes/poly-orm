export default class RegExpLike {
    private static readonly supportedFlags = new Set(['i', 'm', 'n', 'c', 'u'])

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static regExpLike(value: string, regex: RegExp) {
        const [source, flags] = this.parse(regex)
        return flags
            ? `REGEXP_LIKE(${value}, '${source}', '${flags}')`
            : `REGEXP_LIKE(${value}, '${source}')`
    }

    // Privates ---------------------------------------------------------------
    private static parse(regex: RegExp): [string, string | undefined] {
        return [
            regex.source,
            [...regex.flags]
                .filter(f => this.supportedFlags.has(f))
                .join('') ?? undefined
        ]
    }
}