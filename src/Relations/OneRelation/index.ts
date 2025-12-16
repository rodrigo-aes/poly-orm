import util from "util"

// Utils
import ProxyMerge from "../../utils/ProxyMerge"

// Handlers
import { MySQLOperation, type DeleteResult } from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { Entity, Constructor, EntityJSON } from "../../types"
import type { OneRelationMetadataType } from "../../Metadata"
import type {
    OneRelationHandlerSQLBuilder,
    RelationUpdateAttributes,
} from "../../SQLBuilders"


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
        return new ProxyMerge(this, 'instance') as any
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): OneRelationHandlerSQLBuilder<T, R>

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
        return this.instance = await MySQLOperation.Relation.findOne(
            this.related,
            this.sqlBuilder.loadSQL()
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Update related entity in database
     * @param attributes - Update attributes data
     * @returns - Result header containing details of operation
     */
    public update(attributes: RelationUpdateAttributes<R>): Promise<
        ResultSetHeader
    > {
        return MySQLOperation.Relation.update(
            this.related,
            this.sqlBuilder.updateSQL(attributes)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete related entity in database
     * @returns - Delete result
     */
    public delete(): Promise<DeleteResult> {
        return MySQLOperation.Relation.delete(
            this.related,
            this.sqlBuilder.deleteSQL()
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): EntityJSON<R, R['hidden']> | null {
        return (this.instance as R | undefined)?.toJSON() ?? null
    }
}