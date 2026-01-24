import Command from "../Command"
import { ConfigFileTemplate } from "../../ModuleTemplates"

export default class InitCommander extends Command {
    constructor(protected command: string) {
        super(command)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public execute(): void {
        new ConfigFileTemplate().create()
    }

    // Protecteds -------------------------------------------------------------
    protected define(): void { }
}