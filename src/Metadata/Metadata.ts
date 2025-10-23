import type { Target, Constructor } from "../types"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../Errors"

export default abstract class Metadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get KEY(): string {
        throw new Error
    }

    // Protecteds -------------------------------------------------------------
    protected static get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        throw new Error
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find<T extends Constructor<Metadata>>(
        this: T,
        target: Target
    ): InstanceType<T> | undefined {
        return Reflect.getOwnMetadata(
            (this as T & typeof Metadata).KEY,
            target
        )
    }

    // ------------------------------------------------------------------------

    public static build<T extends Constructor<Metadata>>(
        this: T,
        target: Target,
        ...args: any[]
    ): InstanceType<T> {
        return new this(target, ...args) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends Constructor<Metadata>>(
        this: T,
        target: Target,
        ...args: any[]
    ): InstanceType<T> {
        return (this as T & typeof Metadata).find(target)
            ?? (this as T & typeof Metadata).build(target, ...args)
    }

    // ------------------------------------------------------------------------

    public static findOrThrow<T extends Constructor<Metadata>>(
        this: T,
        target: Target
    ): InstanceType<T> {
        return (this as T & typeof Metadata).find(target)! ?? (
            PolyORMException.Metadata.throw(
                (this as T & typeof Metadata).UNKNOWN_ERROR_CODE,
                target.name
            )
        )
    }
}