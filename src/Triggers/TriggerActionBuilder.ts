// Symbols
import { Old, New } from "./Symbols"

// Types
import type { Constructor } from "../types"
import type { BaseEntity } from "../Entities"

import type {
    TriggerActionOptions,
    SetAction,
    InsertIntoTableAction,
    UpdateTableAction,
    DeleteFromAction,
} from "./types"

import type {
    UpdateAttributes,
    CreateOneOrManyAttributes,
    ConditionalQueryOptions
} from "../SQLBuilders"

export default abstract class TriggerActionBuilder<T extends BaseEntity> {
    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    /**
     * Define set params in same table of trigger event action
     * @param attributes - Attributes to set
     * @returns {SetAction<T>} - Set action
     */
    protected set(attributes: TriggerActionOptions<UpdateAttributes<T>>): (
        SetAction<T>
    ) {
        return {
            type: 'SET',
            attributes
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Define INSERT INTO another table action
     * @param target - Table entity target
     * @param attributes - Attributes to insert on table
     * @returns {InsertIntoTableAction<T>} - Insert table action
     */
    protected insertInto<T extends BaseEntity>(
        target: Constructor<T>,
        attributes: TriggerActionOptions<
            CreateOneOrManyAttributes<T>
        >
    ): InsertIntoTableAction<T> {
        return {
            type: 'INSERT INTO',
            target,
            attributes
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Define UPDATE TABLE action to another table target
     * @param target - Table entity target
     * @param where - Where conditional options to match register in table
     * @param attributes - Attributes to update on table
     * @param target - Table entity target
     * @param where - Where conditional options to match register in table
     * @returns {InsertIntoTableAction<T>} - Update table action
     */
    protected updateTable<T extends BaseEntity>(
        target: Constructor<T>,
        attributes: TriggerActionOptions<
            UpdateAttributes<T>
        >,
        where?: TriggerActionOptions<
            ConditionalQueryOptions<T>
        >
    ): UpdateTableAction<T> {

        return {
            type: 'UPDATE TABLE',
            target,
            attributes,
            where
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Define DELETE FROM another table target action
     * @param target - Table entity target
     * @param where - Where conditional options to match register in table
     * @returns {DeleteFromAction<T>} - Delete from action
     */
    protected deleteFrom<T extends BaseEntity>(
        target: Constructor<T>,
        where: TriggerActionOptions<
            ConditionalQueryOptions<T>
        >
    ): DeleteFromAction<T> {
        return {
            type: 'DELETE FROM',
            target,
            where
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Define value to OLD.column in action
     * @param column - Column name
     * @returns - Old column value
     */
    protected old(column: string): { [Old]: string } {
        return { [Old]: `OLD.${column}` }
    }

    // ------------------------------------------------------------------------

    /**
     * Define value to NEW.column in action
     * @param column - Column name
     * @returns - New column value
     */
    protected new(column: string): { [New]: string } {
        return { [New]: `NEW.${column}` }
    }
}