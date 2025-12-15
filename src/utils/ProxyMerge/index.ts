export default class ProxyMerge<
    T extends object,
    S extends (object | string)[]
> {
    private sources: S

    constructor(target: T, ...sources: S) {
        this.sources = sources

        return new Proxy(target, {
            get: this.get.bind(this),
            set: this.set.bind(this)
        })
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private get(target: any, prop: string, receiver: any): any {
        const [t, value] = this.handleTargetGetter(target, prop, receiver)

        return typeof value === "function"
            ? value.bind(t)
            : value
    }

    // ------------------------------------------------------------------------

    private set(
        target: any,
        prop: string,
        value: any,
        receiver: any
    ): boolean {
        for (const source of this.sources) switch (typeof source) {
            case "string": if (
                target[source] && prop in target[source]
            ) return (
                Reflect.set(target[source], prop, value, receiver)
            )
                break

            // ----------------------------------------------------------------

            case "object": if (prop in source) return (
                Reflect.set(source, prop, value, receiver)
            )
                break
        }

        return Reflect.set(target, prop, value, receiver)
    }

    // ------------------------------------------------------------------------

    private handleTargetGetter(target: any, prop: string, receiver: any): [
        any, any
    ] {
        for (const source of this.sources) switch (typeof source) {
            case "string": if (
                target[source] && prop in target[source]
            ) return [
                target[source],
                Reflect.get(target[source], prop, receiver)
            ]
                break

            // ----------------------------------------------------------------

            case "object": if (prop in source) return [
                source,
                Reflect.get(source, prop, receiver)
            ]
                break
        }

        return [target, Reflect.get(target, prop, receiver)]
    }
}