import type { Target, Constructor } from "../types"

// Helpers
import { GeneralHelper } from "../Helpers"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../Errors"

export default abstract class MetadataArray<
    T extends any = any
> extends Array<T> {
    constructor(public target?: Target, ...childs: T[]) {
        super(...childs)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get KEY(): string {
        return (this.constructor as typeof MetadataArray).KEY
    }

    // ------------------------------------------------------------------------

    protected get SHOULD_REGISTER(): boolean {
        return true
    }

    // ------------------------------------------------------------------------

    protected get SHOULD_MERGE(): boolean {
        return true
    }

    // ------------------------------------------------------------------------

    protected get SEARCH_KEYS(): (keyof T | string)[] {
        return []
    }

    // ------------------------------------------------------------------------

    protected get UNIQUE_MERGE_KEYS(): (keyof T | string)[] {
        return []
    }

    // ------------------------------------------------------------------------

    protected get UNKNOWN_ERROR_CODE(): MetadataErrorCode | undefined {
        return undefined
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get [Symbol.species](): typeof Array {
        return Array
    }

    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public search(search: any): T | undefined {
        return this.find(child => this.SEARCH_KEYS.some(
            key => child[key as keyof T] === search
        ))
    }

    // ------------------------------------------------------------------------

    public findOrThrow(search: any): T {
        return this.search(search)! ?? this.throwUnknownChildError(search)
    }

    // ------------------------------------------------------------------------

    public add(...childs: T[]): this {
        this.push(...childs)
        return this
    }

    // ------------------------------------------------------------------------

    public addR(...childs: T[]): T[] {
        this.add(...childs)
        return childs
    }

    // ------------------------------------------------------------------------

    public set(search: any, data: Partial<{ [K in keyof T]: T[K] }>): void {
        const child = this.search(search)
        Object.assign(child as any, data)
    }

    // ------------------------------------------------------------------------

    public toJSON(): any {
        return Array.from(this)
    }

    // Protecteds -------------------------------------------------------------
    protected init(): void {
        if (this.SHOULD_REGISTER) this.register()
        if (this.SHOULD_MERGE && this.target) this.mergeParentsChilds()
    }

    // ------------------------------------------------------------------------

    protected register() {
        Reflect.defineMetadata(this.KEY, this, this.target ?? this.constructor)
    }

    // ------------------------------------------------------------------------

    protected getParentChilds(): T[] {
        type C = Constructor<MetadataArray> & typeof MetadataArray
        return (this.constructor as C).parentsChilds<T>(
            this.target!,
            this.UNIQUE_MERGE_KEYS.map(key => [
                key as string,
                this.flatMap(child => child[key as keyof T] ?? [])
            ])
        )
    }

    // Privates ---------------------------------------------------------------
    private mergeParentsChilds(): void {
        this.push(...this.getParentChilds())
    }

    // ------------------------------------------------------------------------

    private throwUnknownChildError(search: any): void {
        const source: string = typeof search === 'string' ? search : (
            search.name ?? search.toString() ?? search
        )

        throw this.UNKNOWN_ERROR_CODE
            ? PolyORMException.Metadata.instantiate(
                this.UNKNOWN_ERROR_CODE!, source, this.target!.name
            )
            : new Error(
                `Unknown "${source}" metadata to ${(
                    this.target!.name
                )} entity class`
            )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target
    ): InstanceType<T> | undefined {
        return Reflect.getOwnMetadata(
            (this as T & typeof MetadataArray).KEY,
            target ?? this
        )
    }

    // ------------------------------------------------------------------------

    public static build<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target,
        ...args: any[]
    ): InstanceType<T> {
        return new this(target, ...args) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target,
        ...childs: any[]
    ): InstanceType<T> {
        return (this as T & typeof MetadataArray).find(target)?.add(...childs)
            ?? (this as T & typeof MetadataArray).build(target, ...childs)
    }

    // Privates ---------------------------------------------------------------
    private static parentsChilds<
        T extends any = any,
        C extends Constructor<MetadataArray> = Constructor<MetadataArray>
    >(
        this: C,
        target: Target,
        uniqueIn?: [string, any[]][]
    ): T[] {
        return GeneralHelper.objectParents(target).flatMap(
            parent => (this as C & typeof MetadataArray)
                .find(parent)
                ?.filter(
                    (child: any) => uniqueIn
                        ? uniqueIn.every(
                            ([key, values]) => !values.includes(child[key])
                        )
                        : true
                )
                ?? []
        )
    }
}