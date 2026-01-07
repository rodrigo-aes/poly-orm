import { TriggersSchema } from "../../../DatabaseSchema"
import TriggerSyncronizer from "./TriggerSyncronizer"

export default class TriggersSyncronizer extends TriggersSchema<
    TriggerSyncronizer
> {
    declare protected previous?: TriggersSyncronizer

    protected static override get TriggerConstructor(): (
        typeof TriggerSyncronizer
    ) {
        return TriggerSyncronizer
    }

    // Intance Methods ========================================================
    // Publics ----------------------------------------------------------------
    public async createAll(): Promise<void> {
        for (const trigger of this) await trigger.create(this.connection)
    }

    // ------------------------------------------------------------------------

    public async alterAll(): Promise<void> {
        await this.dropInexistents()

        for (const trigger of this) await trigger.executeAction(
            this.connection,
            (await this.previousSchema()).findTrigger(
                trigger.tableName,
                trigger.name
            )
        )

    }

    // ------------------------------------------------------------------------

    public async dropAll(): Promise<void> {
        for (const trigger of await this.previousSchema()) (
            await trigger.drop(this.connection)
        )
    }

    // ------------------------------------------------------------------------

    public async reset(): Promise<void> {
        await this.dropAll()
        await this.createAll()
    }

    // Protecteds -------------------------------------------------------------
    protected override async previousSchema(): Promise<TriggersSyncronizer> {
        if (this.previous) return this.previous

        return this.previous = new TriggersSyncronizer(
            this.connection,
            ...(await this.connection.query(
                TriggersSyncronizer.triggersSchemaQuery(
                    this.connection.database
                )
            ))
                .map(initMap => new TriggerSyncronizer(initMap))
        )
    }

    // Privates ---------------------------------------------------------------
    private async dropInexistents(): Promise<void> {
        for (const trigger of ((await this.previousSchema()).filter(
            ({ tableName, name }) => !this.findTrigger(tableName, name)
        ))) (
            await trigger.drop(this.connection)
        )
    }
}