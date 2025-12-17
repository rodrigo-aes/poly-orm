import ConnectionsMetadata from "../ConnectionsMetadata"
import EntityMetadata from "../EntityMetadata"
import PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"
import { JoinTablesMetadata } from "../EntityMetadata"

import { BaseEntity } from "../../Entities"
import { BasePolymorphicEntity } from "../../Entities"

// Components
import TempMetadata from "../TempMetadata"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type {
    Entity,
    EntityTarget,
    Target,
    TargetMetadata,
    TargetRepository,
    Constructor
} from "../../types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MetadataHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static registerEntitiesConnection(
        connection: PolyORMConnection,
        ...targets: EntityTarget[]
    ): void {
        for (const target of targets) EntityMetadata
            .findOrThrow(target)
            .defineDefaultConnection(connection)
    }

    // ------------------------------------------------------------------------

    public static normalize() {
        JoinTablesMetadata.makeAllUnique()
    }

    // ------------------------------------------------------------------------

    public static register<T extends Entity>(
        metadata: TargetMetadata<T>,
        target: Constructor<T>,
    ): void {
        Reflect.defineMetadata(
            this.resolveTargetMetadataKey(target),
            metadata,
            target
        )
    }

    // ------------------------------------------------------------------------

    public static targetMetadata<T extends Entity>(target: Constructor<T>): (
        TargetMetadata<T>
    ) {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                EntityMetadata.find(target)
                ?? TempMetadata.getMetadata(target)
            ) as TargetMetadata<T>

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                PolymorphicEntityMetadata.find(target)
                ?? TempMetadata.getMetadata(target)
            ) as TargetMetadata<T>

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }

    // ------------------------------------------------------------------------

    public static getConnection(target: Target, shouldThrow: boolean = true): (
        PolyORMConnection
    ) {
        return TempMetadata.getConnection(target)
            ?? Reflect.getOwnMetadata('default-connection', target)!
            ?? (
                shouldThrow ?
                    PolyORMException.Metadata.throw(
                        'MISSING_ENTITY_CONNECTION', target.name
                    )
                    : undefined
            )
    }

    // ------------------------------------------------------------------------

    public static setDefaultConnection(
        connection: PolyORMConnection | string,
        target: Target
    ): void {
        if (!Reflect.getOwnMetadata('default-connection', target)) (
            Reflect.defineMetadata(
                'default-connection',
                this.resolveConnection(connection),
                target
            )
        )
    }

    // ------------------------------------------------------------------------

    public static setTempConnection(
        connection: PolyORMConnection | string,
        target: Target
    ): void {
        TempMetadata.setConnection(target, this.resolveConnection(connection))
    }

    // ------------------------------------------------------------------------

    public static getRepository<T extends Entity>(
        target: Constructor<T>
    ): Constructor<TargetRepository<T>> | undefined {
        return Reflect.getOwnMetadata('repository', target)
    }

    // ------------------------------------------------------------------------

    public static setRepository<T extends Entity>(
        repository: Constructor<TargetRepository<T>>,
        target: Constructor<T>
    ): void {
        Reflect.defineMetadata('repository', repository, target)
    }

    // Privates ---------------------------------------------------------------
    private static resolveConnection(connection: PolyORMConnection | string): (
        PolyORMConnection
    ) {
        switch (typeof connection) {
            case 'object': return connection
            case 'string': return ConnectionsMetadata.getOrThrow(connection)
        }
    }

    // ------------------------------------------------------------------------

    private static resolveTargetMetadataKey(target: Target): string {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                EntityMetadata.KEY
            )

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                PolymorphicEntityMetadata.KEY
            )

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }
}