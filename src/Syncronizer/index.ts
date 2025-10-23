// Syncronizers
import DatabaseSyncronizer from "./DatabaseSyncronizer"

// Utils
import Log from "../utils/Log"

// Static
import { defaultConfig } from "./static"

// Types
import type { PolyORMConnection } from "../Metadata"
import type { SyncronizerConfig } from "./types"

export default class Syncronizer {
    private config: SyncronizerConfig
    private database: DatabaseSyncronizer

    constructor(
        private connection: PolyORMConnection,
        config: SyncronizerConfig = {}
    ) {
        this.config = { ...defaultConfig, ...config }

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