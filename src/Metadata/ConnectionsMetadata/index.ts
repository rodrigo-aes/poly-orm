import MetadataMap from "../MetadataMap"

// Types
import type { PolyORMConnection, MySQLConnection } from "./contracts"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../../Errors"

class ConnectionsMetadata extends MetadataMap<string, PolyORMConnection> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_CONNECTION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        return 'connections-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override get(name: string): PolyORMConnection {
        return super.get(name)! ?? PolyORMException.Metadata.throw(
            'UNKNOWN_CONNECTION', name
        )
    }
}

export default new ConnectionsMetadata
export type {
    PolyORMConnection,
    MySQLConnection
} 