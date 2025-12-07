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
    Collection,

    type Pagination,
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
    StaticPolymorphicEntityTarget
} from "../../types"

import type {
    MySQL2RawData,
    MappedDataType,
    EntityData,
    JSONData,
    DataFillMethod
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MySQL2RawDataHandler<T extends Target> {
    private metadata: TargetMetadata<T>

    constructor(
        public target: T,
        public fillMethod: DataFillMethod,
        private raw: MySQL2RawData[]
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
            )
                .shift() ?? null

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

    public entity<M extends Target = T>(
        mapTo: M | T = this.target,
        pagination?: PaginationInitMap
    ): EntityData<InstanceType<M>> {
        return this.fill(
            this.fillMethod,
            mapTo,
            this.reduce(
                this.raw,
                this.metadata,
                'entity',
                undefined,
                mapTo
            ) as InstanceType<M>[],
            pagination
        ) as EntityData<InstanceType<M>>
    }

    // Privates ---------------------------------------------------------------
    private fill<M extends Target = T>(
        method: DataFillMethod = this.fillMethod,
        mapTo: M | T = this.target,
        data: InstanceType<M>[],
        pagination?: PaginationInitMap
    ): EntityData<InstanceType<M>> {
        switch (method) {
            case "One": return data.shift() ?? null

            // ----------------------------------------------------------------

            case "Many": return CollectionsMetadataHandler.build(
                mapTo,
                data
            ) as Collection<InstanceType<M>>

            // ----------------------------------------------------------------

            case "Paginate": return PaginationMetadataHandler.build(
                mapTo,
                pagination!,
                data
            ) as Pagination<InstanceType<M>>
        }
    }

    // ------------------------------------------------------------------------

    private reduce<M extends Target = T>(
        raw: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json',
        relation?: RelationMetadataType,
        mapTo: M | T = this.target
    ): MappedDataType<M, typeof method>[] {
        if (raw.length === 0) return raw

        raw = raw.map(item => this.removeAlias(
            item, this.firstAlias(raw)
        ))

        const reduced: MappedDataType<M, typeof method>[] = []
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
                    ...this.filterColumns<M>(toMerge.shift()),
                    ...this.filterRelations<M>(toMerge, metadata, method)
                })
                    break

                // ------------------------------------------------------------

                case "entity":
                    const entity = this.mapToEntity(
                        mapTo,
                        this.filterColumns<M>(toMerge.shift()),
                        (relation as any)?.shouldMapToSource
                    )

                    reduced.push(
                        entity.fill(
                            this.filterRelations<M>(
                                toMerge,
                                metadata,
                                method,
                                entity
                            )
                        ) as InstanceType<M>
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
        target: PolymorphicEntityTarget,
        data: any,
        toSource: boolean
    ): Entity {
        return toSource
            ? (target as StaticPolymorphicEntityTarget)
                .build(data)
                .toSourceEntity()

            : (target as StaticPolymorphicEntityTarget)
                .build(data)
    }

    // ------------------------------------------------------------------------

    private filterColumns<Entity extends Target = T>(raw: MySQL2RawData): (
        JSONData<Entity>
    ) {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        )) as JSONData<Entity>
    }

    // ------------------------------------------------------------------------

    private filterRelations<M extends Target = T>(
        raw: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json',
        parent?: Entity
    ): { [K: string]: MappedDataType<M, typeof method> } {
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
        ) as { [K: string]: MappedDataType<M, typeof method> }
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
                case 'One': return data.shift() ?? null
                case 'Many': return data
            }

            // ----------------------------------------------------------------

            case 'entity': return (
                Relations[(
                    relation.type.charAt(0).toLocaleLowerCase() +
                    relation.type.slice(1) as keyof typeof Relations
                )] as any
            )(
                ...(() => {
                    switch (relation.fillMethod) {
                        case 'One': return [relation, parent, data.shift()]

                        // ----------------------------------------------------

                        case 'Many': return [
                            relation,
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
        raw: MySQL2RawData[],
        key: string
    ): MySQL2RawData[] {
        return raw
            .map(item => Object.fromEntries(
                Object
                    .entries(item)
                    .filter(([path]) => path.startsWith(`${key}_`))
            ) as MySQL2RawData)
            .filter(item => !this.allNull(item))
    }

    // ------------------------------------------------------------------------

    private filterRelationsKeys(raw: MySQL2RawData[]): Set<string> {
        return new Set(raw.flatMap(item => Object.keys(item).flatMap(
            key => key.includes('_')
                ? key.split('_')[0]
                : []
        )))
    }

    // ------------------------------------------------------------------------

    private allNull(columns: JSONData<T>): boolean {
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
    type MySQL2RawData,
    type JSONData as RawData,
    type DataFillMethod
}