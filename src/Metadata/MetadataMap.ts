// Helpers
import { GeneralHelper } from "../Helpers"

// Types
import type { Target, CollectionTarget, Constructor } from "../types"

// Exceptions
import PolyORMException, { MetadataErrorCode } from "../Errors"

export default abstract class MetadataMap<
    K extends string | number | symbol = any,
    T extends any = any
> extends Map<K, T> {
    constructor(public target?: Target | CollectionTarget) {
        super()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get KEY(): string {
        return (this.constructor as typeof MetadataMap).KEY
    }

    // ------------------------------------------------------------------------

    protected get UNKNOWN_ERROR_CODE(): MetadataErrorCode | undefined {
        return undefined
    }

    // ------------------------------------------------------------------------

    protected get SHOULD_REGISTER(): boolean {
        return true
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public all() {
        return Array.from(this.values())
    }

    // ------------------------------------------------------------------------

    public getOrThrow(key: K): T {
        return this.get(key)! ?? this.throwUnknownError(key)
    }

    // ------------------------------------------------------------------------

    public toJSON(): any {
        return Object.fromEntries(this.entries())
    }

    // Protecteds -------------------------------------------------------------
    protected init(): void {
        if (this.SHOULD_REGISTER) this.register()
        if (this.target) this.mergeParents()
    }

    // ------------------------------------------------------------------------

    protected register() {
        Reflect.defineMetadata(this.KEY, this, this.target ?? this.constructor)
    }

    // Privates ---------------------------------------------------------------
    private mergeParents(): void {
        type C = Constructor<MetadataMap> & typeof MetadataMap

        for (const parent of (this.constructor as C).parents(this.target!))
            for (const [key, value] of parent.entries()) this.set(
                key as K,
                value
            )
    }

    // ------------------------------------------------------------------------

    private throwUnknownError(key: K): void {
        if (this.UNKNOWN_ERROR_CODE) PolyORMException.Metadata.throw(
            this.UNKNOWN_ERROR_CODE!,
            key,
            this.target?.name ?? this.constructor.name
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget
    ): InstanceType<T> | undefined {
        return Reflect.getOwnMetadata(
            (this as T & typeof MetadataMap).KEY,
            target ?? this
        )
    }

    // ------------------------------------------------------------------------

    public static build<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget,
    ): InstanceType<T> {
        return new this(target) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget
    ): InstanceType<T> {
        return (this as T & typeof MetadataMap).find(target)
            ?? (this as T & typeof MetadataMap).build(target)
    }

    // Privates ---------------------------------------------------------------
    private static parents<T extends Constructor<MetadataMap>>(
        this: T,
        target: Target | CollectionTarget
    ): InstanceType<T>[] {
        return GeneralHelper
            .objectParents(target)
            .flatMap(
                parent => (this as T & typeof MetadataMap).find(parent) ?? []
            )
            .reverse()
    }
}