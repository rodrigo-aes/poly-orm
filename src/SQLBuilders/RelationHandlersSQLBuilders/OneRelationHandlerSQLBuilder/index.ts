import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Types
import type { OneRelationMetadataType } from "../../../Metadata"
import type { Entity, EntityTarget } from "../../../types"
import type {
    RelationCreationAttributes,
    RelationUpdateAttributes,
    RelationUpdateOrCreateAttributes
} from "./types"

export default abstract class OneRelationHandlerSQLBuilder<
    RelationMetadata extends OneRelationMetadataType,
    T extends Entity,
    R extends Entity
> extends RelationHandlerSQLBuilder<RelationMetadata, T, R> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(): string {
        return `${this.selectSQL()} ${this.fixedWhereSQL()} LIMIT 1`
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: RelationCreationAttributes<R>): string {
        return `INSERT INTO ${this.relatedTable} (${(
            this.insertColumnsSQL(attributes)
        )}) VALUES (${this.insertValuesSQL(attributes)})`
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(
        attributes: RelationUpdateOrCreateAttributes<R>
    ): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.creationAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(attributes: RelationUpdateAttributes<R>): string {
        return `UPDATE ${this.relatedTableAlias} ${this.setSQL(attributes)} ${(
            this.fixedWhereSQL()
        )}`
    }

    // ------------------------------------------------------------------------

    public deleteSQL(): string {
        return `DELETE FROM ${this.relatedTableAlias} ${this.fixedWhereSQL()}`
    }
}

export type {
    RelationCreationAttributes,
    RelationUpdateAttributes,
    RelationUpdateOrCreateAttributes
}