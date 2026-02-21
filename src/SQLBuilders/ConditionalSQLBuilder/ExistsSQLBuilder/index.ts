// SQL Builders
import ConditionalSQLBuilder, { ConditionalQueryOptions } from ".."
import UnionSQLBuilder from "../../UnionSQLBuilder"

// Symbols
import { Exists, Cross } from "./Symbol"

// Handlers
import { MetadataHandler, type RelationMetadata } from "../../../Metadata"
import { SQLString } from '../../../Handlers'

// Types
import type { Entity, Constructor, TargetMetadata } from "../../../types"
import type {
    ExistsQueryOptions,
    EntityExistsQueryOptions,
    EntityExistsQueryOption
} from "./types"

export default class ExistsSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>
    public unions: UnionSQLBuilder[] = []

    constructor(
        public target: Constructor<T>,
        public options: string | ExistsQueryOptions<T>[
            typeof Exists
        ],
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLString.sanitize(this.handleSQL())
    }

    // Privates ---------------------------------------------------------------
    private handleSQL(
        metadata: TargetMetadata<any> = this.metadata,
        options: string | EntityExistsQueryOptions<any> = this.options,
        parentAlias: string = this.alias,
        alias?: string
    ): string {
        return typeof options === 'object'
            ? Object
                .entries(options)
                .map(([relation, options]) => this.existsSQL(
                    metadata,
                    metadata.relations.findOrThrow(relation),
                    typeof options === 'object' ? options : undefined,
                    parentAlias,
                    alias
                ))
                .join(' AND ')

            : options

    }

    // ------------------------------------------------------------------------

    private existsSQL(
        parentMeta: TargetMetadata<any>,
        relation: RelationMetadata,
        options?: EntityExistsQueryOption<any>,
        parentAlias: string = parentMeta.name,
        alias: string = `${parentAlias}_${relation.name}Ex`
    ): string {
        const metadata = MetadataHandler.targetMetadata(relation.relatedTarget)

        return `EXISTS (SELECT 1 FROM ${metadata.tableName} ${alias} ${(
            this.whereSQL(
                parentMeta, metadata, relation, options, parentAlias, alias
            )
        )})`
    }

    // ------------------------------------------------------------------------

    private whereSQL(
        parentMeta: TargetMetadata<any>,
        metadata: TargetMetadata<any>,
        relation: RelationMetadata,
        options?: EntityExistsQueryOption<any>,
        parentAlias?: string,
        alias?: string
    ): string {
        const on = ConditionalSQLBuilder.on<any, any>(
            parentMeta.target,
            metadata.target,
            relation,
            options?.where,
            parentAlias,
            alias
        )

        return `WHERE ${on.fixedSQL()}${on.conditionalSQL(true)}${(
            options?.relations
                ? ` AND ${(this.handleSQL(
                    metadata, options.relations, on.alias
                ))}`
                : ''
        )}`
    }
}

export {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type EntityExistsQueryOption
}