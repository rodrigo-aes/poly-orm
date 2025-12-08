import util from "util"

// Handlers
import {
    MySQL2QueryExecutionHandler,

    type RelationQueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { Entity, Constructor, EntityJSON } from "../../types"
import type { OneRelationMetadataType } from "../../Metadata"
import type { OneRelationHandlerSQLBuilder } from "../../SQLBuilders"
import type { UpdateAttributes } from "../../SQLBuilders"

/**
 * One to one relation handler
 */
export default abstract class OneRelation<T extends Entity, R extends Entity> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: OneRelationMetadataType,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
    ) {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                const [t, value] = target.instance && prop in target.instance
                    ? [
                        target.instance,
                        Reflect.get(target.instance, prop, receiver)
                    ]
                    : [target, Reflect.get(target, prop, receiver)]

                return typeof value === "function"
                    ? value.bind(t)
                    : value
            },

            // ----------------------------------------------------------------

            set(target, prop, value, receiver) {
                return target.instance && prop in target.instance
                    ? Reflect.set(target.instance, prop, value, receiver)
                    : Reflect.set(target, prop, value, receiver)
            }
        })
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): OneRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    /** @internal */
    protected get queryExecutionHandler(): RelationQueryExecutionHandler<R> {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public [util.inspect.custom]() {
        return this.instance
    }

    // ------------------------------------------------------------------------

    /**
     * Load related entity
     * @returns - Related entity intance
     */
    public async load(): Promise<R | null> {
        return this.instance = await this.queryExecutionHandler.executeFindOne(
            this.sqlBuilder.loadSQL()
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Update related entity in database
     * @param attributes - Update attributes data
     * @returns - Result header containing details of operation
     */
    public update(attributes: UpdateAttributes<R>): Promise<ResultSetHeader> {
        return this.queryExecutionHandler.executeUpdate(
            this.sqlBuilder.updateSQL(attributes)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete related entity in database
     * @returns - Delete result
     */
    public delete(): Promise<DeleteResult> {
        return this.queryExecutionHandler.executeDelete(
            this.sqlBuilder.deleteSQL()
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): EntityJSON<R, R['hidden']> | null {
        return (this.instance as R | undefined)?.toJSON() ?? null
    }
}