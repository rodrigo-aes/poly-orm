import {
    MetadataHandler,
    CollectionsMetadataHandler,
    PaginationMetadataHandler,

    type RelationMetadataType
} from "../../Metadata"

// Entities
import {
    BaseEntity,
    BasePolymorphicEntity,

    type PaginationInitMap
} from "../../Entities"

import * as Relations from "../../Relations"

// Types
import type {
    Entity,
    Target,
    TargetMetadata,
    PolymorphicEntityTarget,
    StaticEntityTarget,
    Constructor
} from "../../types"

import type {
    EntityData,
    JSONData,
    FillMethod
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MySQLDataHandler<T extends Entity> {
    private metadata: TargetMetadata<T>

    constructor(
        private target: Constructor<T>,
        private fillMethod: FillMethod,
        private raw: any[],
        private toSource: boolean = false
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public json(): (JSONData<T> | null) | JSONData<T>[] {
        switch (this.fillMethod) {
            case "One": return this.reduce(
                this.raw,
                this.metadata,
                'json'
            )[0] ?? null

            // ----------------------------------------------------------------

            case "Many": return this.reduce(
                this.raw,
                this.metadata,
                'json'
            )

            // ----------------------------------------------------------------

            default: throw new Error('Unreachable error')
        }
    }

    // ------------------------------------------------------------------------

    public entity(
        mapTo: Constructor<T> = this.target,
        pagination?: PaginationInitMap
    ): EntityData<T> {
        return this.fill(
            this.fillMethod,
            mapTo,
            this.reduce(
                this.raw,
                this.metadata,
                'entity',
                undefined,
                mapTo
            ),
            pagination
        )
    }

    // Privates ---------------------------------------------------------------
    private fill(
        method: FillMethod = this.fillMethod,
        mapTo: Constructor<T> = this.target,
        data: T[],
        pagination?: PaginationInitMap
    ): EntityData<T> {
        switch (method) {
            case "One": return data[0] ?? null

            // ----------------------------------------------------------------

            case "Many": return CollectionsMetadataHandler.build(
                mapTo,
                data
            )

            // ----------------------------------------------------------------

            case "Paginate": return PaginationMetadataHandler.build(
                mapTo,
                pagination!,
                data
            )
        }
    }

    // ------------------------------------------------------------------------

    private reduce(
        raw: any[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json',
        relation?: RelationMetadataType,
        mapTo: Target = (relation?.relatedTarget ?? this.target)
    ): any[] {
        if (raw.length === 0) return raw

        raw = raw.map(item => this.removeAlias(
            item, this.firstAlias(raw)
        ))

        const reduced: any[] = []
        const mapped = new Set<string>()
        const pk = metadata.columns.primary.name

        for (const data of raw) {
            const mapKey = data.entityType ?? '' + data[pk]
            if (mapped.has(mapKey)) continue

            const toMerge = raw.filter(item => (
                item[pk] === data[pk] &&
                item.entityType === data.entityType
            ))

            switch (method) {
                case "json": reduced.push({
                    ...this.filterColumns(toMerge[0]),
                    ...this.filterRelations(toMerge, metadata, method)
                })
                    break

                // ------------------------------------------------------------

                case "entity":
                    const entity = this.mapToEntity(
                        mapTo,
                        this.filterColumns(toMerge[0]),
                        (relation as any)?.shouldMapToSource ?? this.toSource
                    )

                    reduced.push(
                        entity.fill(
                            this.filterRelations(
                                toMerge,
                                metadata,
                                method,
                                entity
                            )
                        )
                    )
                    break
            }

            mapped.add(mapKey)
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private mapToEntity(
        target: Target,
        data: any,
        toSource: boolean
    ): Entity {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                (target as StaticEntityTarget).build(data)
            )

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                this.mapToPolymorphicEntity(
                    target as PolymorphicEntityTarget,
                    data,
                    toSource
                )
            )

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }

    // ------------------------------------------------------------------------

    private mapToPolymorphicEntity(
        target: any,
        data: any,
        toSource: boolean
    ): Entity {
        return toSource
            ? target.build(data).toSourceEntity()
            : target.build(data)
    }

    // ------------------------------------------------------------------------

    private filterColumns(raw: any): any {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        ))
    }

    // ------------------------------------------------------------------------

    private filterRelations(
        raw: any[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json',
        parent?: Entity
    ): { [K: string]: any } {
        return Object.fromEntries(
            Array
                .from(this.filterRelationsKeys(raw))
                .flatMap(key => {
                    const relation = metadata.relations.findOrThrow(key)
                    return [[key, this.fillRelation(
                        method,
                        this.reduce(
                            this.filterRelationsByKey(raw, key),
                            MetadataHandler.targetMetadata(
                                relation.relatedTarget
                            ),
                            method,
                            relation
                        ),
                        relation,
                        parent
                    )]]
                })
        )
    }

    // ------------------------------------------------------------------------

    private fillRelation(
        method: 'json' | 'entity' = 'json',
        data: any,
        relation: RelationMetadataType,
        parent?: Entity
    ) {
        switch (method) {
            case 'json': switch (relation.fillMethod) {
                case 'One': return data[0] ?? null
                case 'Many': return data
            }

            // ----------------------------------------------------------------

            case 'entity': return (
                Relations[(
                    relation.type + 'Handler' as keyof typeof Relations
                )] as any
            )(
                ...(() => {
                    switch (relation.fillMethod) {
                        case 'One': return [relation, parent, data[0]]

                        // ----------------------------------------------------

                        case 'Many': return [
                            relation as any,
                            parent,
                            undefined,
                            new relation.collection!(...data)
                        ]
                    }
                })() as any[]
            )
        }
    }

    // ------------------------------------------------------------------------

    private filterRelationsByKey(
        raw: any[],
        key: string
    ): any[] {
        return raw
            .map(item => Object.fromEntries(
                Object
                    .entries(item)
                    .filter(([path]) => path.startsWith(`${key}_`))
            ))
            .filter(item => !this.allNull(item))
    }

    // ------------------------------------------------------------------------

    private filterRelationsKeys(raw: any[]): Set<string> {
        return new Set(raw.flatMap(item => Object.keys(item).flatMap(
            key => key.includes('_')
                ? key.split('_')[0]
                : []
        )))
    }

    // ------------------------------------------------------------------------

    private allNull(columns: any): boolean {
        return Object.entries(columns)
            .map(([_, value]) => value)
            .every(value => value === null)
    }

    // ------------------------------------------------------------------------

    private removeAlias(raw: any, alias: string): any {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.startsWith(`${alias}_`)
                ? [[key.replace(`${alias}_`, ''), value]]
                : []
        ))
    }

    // ------------------------------------------------------------------------

    private firstAlias(rawData: any): string {
        return Object.keys(rawData[0])[0].split('_')[0]
    }
}

export {
    type FillMethod
}