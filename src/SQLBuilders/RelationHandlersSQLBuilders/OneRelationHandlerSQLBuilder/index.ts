import RelationHandlerSQLBuilder from "../RelationHandlerSQLBuilder"

// SQL Builders
import UpdateOrCreateSQLBuilder, {
    type UpdateOrCreateAttibutes
} from "../../UpdateOrCreateSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { OneRelationMetadataType } from "../../../Metadata"
import type { Entity, EntityTarget } from "../../../types"
import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class OneRelationHandlerSQLBuilder<
    RelationMetadata extends OneRelationMetadataType,
    T extends Entity,
    R extends Entity
> extends RelationHandlerSQLBuilder<RelationMetadata, T, R> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public loadSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.selectSQL()} ${this.fixedWhereSQL()} LIMIT 1`
        )
    }

    // ------------------------------------------------------------------------

    public createSQL(attributes: CreationAttributes<R>): (
        [string, any[]]
    ) {
        return [
            SQLStringHelper.normalizeSQL(`
                INSERT INTO ${this.relatedTable}
                (${this.insertColumnsSQL(attributes)})
                VALUES (${this.placeholderSetSQL(attributes)})
            `),
            this.createValues(attributes)
        ]
    }

    // ------------------------------------------------------------------------

    public updateOrCreateSQL(attributes: UpdateOrCreateAttibutes<R>): string {
        return new UpdateOrCreateSQLBuilder(
            this.related as EntityTarget,
            this.mergeAttributes(attributes)
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    public updateSQL(attributes: UpdateAttributes<R>): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.relatedTableAlias}
            ${this.setSQL(attributes)}
            ${this.fixedWhereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public deleteSQL(): string {
        return `DELETE FROM ${this.relatedAlias} ${this.fixedWhereSQL()}`
    }

    // Protecteds -------------------------------------------------------------
    protected insertColumnsSQL(attributes: CreationAttributes<R>): string {
        return this.attributesKeys(attributes).join(', ')
    }

    // ------------------------------------------------------------------------

    protected insertValuesSQL(attributes: CreationAttributes<R>): string {
        return this.attributesValues(attributes)
            .map(value => PropertySQLHelper.valueSQL(value))
            .join(', ')
    }
}