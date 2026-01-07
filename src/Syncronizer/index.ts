// Syncronizers
import DatabaseSyncronizer from "./DatabaseSyncronizer"

// Types
import type { PolyORMConnection } from "../Metadata"

export default class Syncronizer {
    private database: DatabaseSyncronizer

    constructor(private connection: PolyORMConnection) {
        this.database = DatabaseSyncronizer.buildFromConnectionMetadata(
            this.connection
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async alter(): Promise<void> {
        await this.database.alter()
        console.log('finished')
    }

    // ------------------------------------------------------------------------

    public async reset(): Promise<void> {
        await this.database.reset()
        console.log('finished')
    }
}