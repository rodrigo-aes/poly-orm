import TriggerActionBuilder
    from "../../../Triggers/TriggerActionBuilder"

// SQL Builders
import CreateSQLBuilder from "../../CreateSQLBuilder"
import UpdateSQLBuilder, { type UpdateAttributes } from "../../UpdateSQLBuilder"
import DeleteSQLBuilder from "../../DeleteSQLBuilder"
import { li, type Literals } from "../../Literal"

// Symbols
import { Old } from "../../../Triggers"

// Helpers
import { SQLString } from "../../../Handlers"

// Types
import type { BaseEntity } from "../../../Entities"
import type {
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation,
    TriggerAction,
    TriggerActionOptions,
    SetAction,
    InsertIntoTableAction,
    UpdateTableAction,
    DeleteFromAction,
} from "../../../Triggers"
import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"

export default abstract class TriggerSQLBuilder<
    T extends BaseEntity
> extends TriggerActionBuilder<T> {
    /** @internal */
    public abstract timing?: TriggerTiming

    /** @internal */
    public abstract event?: TriggerEvent

    /** @internal */
    public abstract orientation?: TriggerOrientation

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public abstract get name(): string

    // ------------------------------------------------------------------------

    /** @internal */
    public abstract get tableName(): string

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------  
    /** @internal */
    protected abstract action(li: Literals): string | TriggerAction<T>[]

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected createSQL(): string {
        return `CREATE TRIGGER ${this.name} ${this.timing} ${this.event} ON ${(
            this.tableName
        )} FOR EACH ${this.orientation} ${this.actionSQL()}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected alterSQL(): string {
        return `${this.dropSQL()}; ${this.createSQL()}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected dropSQL(): string {
        return `DROP TRIGGER IF EXISTS ${this.name}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public actionSQL(): string {
        return `BEGIN ${this.actionBodySQL()} END`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public actionBodySQL(): string {
        const action = this.action(li)
        return typeof action === 'string'
            ? SQLString.sanitize(action)
            : action
                .map((action) => this.handleActionSQL(action))
                .join('; ') + ';'
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private handleActionSQL(action: TriggerAction<T>): string {
        if (typeof action === 'string') return SQLString.sanitize(action)

        switch (action.type) {
            case "SET": return this.setSQL(action as SetAction<T>)

            // ----------------------------------------------------------------

            case "INSERT INTO": return this.insertIntoSQL(action as (
                InsertIntoTableAction
            ))

            // ----------------------------------------------------------------

            case "UPDATE TABLE": return this.updateTableSQL(action as (
                UpdateTableAction
            ))

            // ----------------------------------------------------------------

            case "DELETE FROM": return this.deleteFromSQL(action as (
                DeleteFromAction
            ))
        }
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private setSQL({ attributes }: SetAction<T>): string {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private insertIntoSQL({ target, attributes }: InsertIntoTableAction): (
        string
    ) {
        return new CreateSQLBuilder(
            target,
            attributes,
            undefined,
            true
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private updateTableSQL({ target, attributes, where }: UpdateTableAction): (
        string
    ) {
        return new UpdateSQLBuilder(
            target,
            attributes,
            where as ConditionalQueryOptions<T>
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private deleteFromSQL({ target, where }: DeleteFromAction): string {
        return new DeleteSQLBuilder(
            target,
            where as ConditionalQueryOptions<T>
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private setValuesSQL(config: TriggerActionOptions<UpdateAttributes<T>>): (
        string
    ) {
        return Object.entries(config).map(
            ([column, value]) => (
                typeof value === 'object' &&
                Object.getOwnPropertySymbols(value).includes(Old)
            )

                ? `NEW.${column} = ${value![Old as keyof typeof value]}`
                : `NEW.${column} = ${SQLString.value(value)}`
        )
            .join(', ')
    }
}