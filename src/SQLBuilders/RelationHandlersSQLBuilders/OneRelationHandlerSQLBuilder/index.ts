import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Types
import type { ToOneRelationMetadata } from "../../../Metadata"
import type { Entity, EntityTarget } from "../../../types"
import type { CreateAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class OneRelationHandlerSQLBuilder<
    M extends ToOneRelationMetadata,
    T extends Entity,
    R extends Entity
> extends RelationHandlerSQLBuilder<M, T, R> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(): string {
        return `${this.selectSQL()} ${this.fixedWhereSQL()} LIMIT 1`
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreateAttributes<R>): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.insertColumnsSQL(attributes)
        )}) VALUES (${this.insertValuesSQL(attributes)})`
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(attributes: CreateAttributes<R>): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.creationAttributes(attributes) as any
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(attributes: UpdateAttributes<R>): string {
        return `UPDATE ${this.relatedTableAlias} ${this.setSQL(attributes)} ${(
            this.fixedWhereSQL()
        )}`
    }

    // ------------------------------------------------------------------------

    public deleteSQL(): string {
        return `DELETE FROM ${this.relatedTableAlias} ${this.fixedWhereSQL()}`
    }
}