import TriggerSQLBuilder from "../../../SQLBuilders/DatabaseSQLBuilders/TriggerSQLBuilder"
import { li, type Literals } from "../../../SQLBuilders"

// Types
import type { BaseEntity } from "../../../Entities"
import type { Constructor } from "../../../types"
import type {
    Trigger,
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation,
    TriggerAction
} from "../../../Triggers"

import type {
    TriggerSchemaInitMap,
    TriggerActionHandler,
    AlreadyDefinedEvent
} from "./types"

export default class TriggerSchema<
    T extends BaseEntity = BaseEntity
> extends TriggerSQLBuilder<T> {
    /** @internal */
    public tableName!: string

    /** @internal */
    public name!: string

    /** @internal */
    public event?: TriggerEvent

    /** @internal */
    public timing?: TriggerTiming

    /** @internal */
    public orientation?: TriggerOrientation

    /** @internal */
    private _action!: string | TriggerActionHandler<T>

    /** @internal */
    constructor(initMap: TriggerSchemaInitMap) {
        super()
        const { action, ...rest } = initMap
        Object.assign(this, { _action: action, ...rest })
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get li(): Literals {
        return li
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `this` timing BEFORE `event`
     * @param {TriggerEvent} event - Trigger event 
     * @returns {this} - `this`
     */
    public before(event: TriggerEvent): AlreadyDefinedEvent<this> {
        this.timing = 'BEFORE'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` timing AFTER `event`
     * @param {TriggerEvent} event - Trigger event 
     * @returns {this} - `this`
     */
    public after(event: TriggerEvent): AlreadyDefinedEvent<this> {
        this.timing = 'AFTER'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` timing INSTEAD OF `event`
     * @param {TriggerEvent} event - Trigger event 
     * @returns {this} - `this`
     */
    public insteadOf(event: TriggerEvent): AlreadyDefinedEvent<this> {
        this.timing = 'INSTEAD OF'
        this.event = event

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define for EACH STATEMENT/ROW orientation
     * @param {TriggerOrientation} orientation - Action orientation
     * @returns {this} - `this`
     */
    public forEach(orientation: TriggerOrientation): this {
        this.orientation = orientation
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define action to execute on event with SQL string or trigger actions
     * array
     * @param action - SQL string or trigger action handler
     */
    public execute(action: string | TriggerActionHandler<T>): void {
        this._action = action
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected action(): string | TriggerAction<T>[] {
        switch (typeof this._action) {
            case 'string': return this._action
            case 'function': return this._action(this)
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public static buildFromTrigger<T extends Constructor<TriggerSchema>>(
        this: T,
        trigger: Trigger
    ): InstanceType<T> {
        return new this({
            tableName: trigger.tableName,
            name: trigger.name,
            event: trigger.event,
            timing: trigger.timing,
            orientation: trigger.orientation,
            action: trigger.action(li)
        }) as InstanceType<T>
    }
}

export {
    type TriggerSchemaInitMap
}