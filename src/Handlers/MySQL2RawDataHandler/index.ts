import {
    RelationMetadata,
    MetadataHandler,
    CollectionsMetadataHandler,
    PaginationMetadataHandler,

    type RelationMetadataType
} from "../../Metadata"

// Base Entity
import {
    Entity,
    BaseEntity,
    BasePolymorphicEntity,
    Collection,
    type PaginationInitMap
} from "../../Entities"

// Types
import type {
    Target,
    TargetMetadata,
    PolymorphicEntityTarget,
    StaticEntityTarget,
    StaticPolymorphicEntityTarget,
} from "../../types"

import type {
    MySQL2RawData,
    MappedDataType,
    RawData,
    DataFillMethod
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MySQL2RawDataHandler<T extends Target> {
    private metadata: TargetMetadata<T>

    constructor(
        public target: T,
        public fillMethod: DataFillMethod,
        private mySQL2RawData: MySQL2RawData[]
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public json(): RawData<T> | RawData<T>[] {
        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'json'
        )

        return this.fillMethod === 'Many' ? reduced : reduced[0]
    }

    // ------------------------------------------------------------------------

    public parseEntity<Entity extends Target = T>(
        mapToEntity?: Entity,
        pagination?: PaginationInitMap
    ): InstanceType<Entity> | Collection<InstanceType<Entity>> {
        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'entity',
            undefined,
            mapToEntity
        ) as InstanceType<Entity>[]

        switch (this.fillMethod) {
            case "One": return reduced[0] ?? null

            // ----------------------------------------------------------------

            case "Many": return CollectionsMetadataHandler.build(
                mapToEntity ?? this.target,
                reduced
            ) as Collection<InstanceType<Entity>>

            // ----------------------------------------------------------------

            case "Paginate": return PaginationMetadataHandler.build(
                mapToEntity ?? this.target,
                pagination!,
                reduced
            ) as Collection<InstanceType<Entity>>
        }
    }

    // Privates ---------------------------------------------------------------
    private reduceMySQL2RawData<Entity extends Target = T>(
        rawData: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json',
        relation?: RelationMetadataType,
        entityToMap?: Entity
    ): MappedDataType<Entity, typeof method>[] {
        if (rawData.length === 0) return rawData

        rawData = rawData.map(item => this.removeAlias(
            item, this.firstAlias(rawData)
        ))

        const reduced: MappedDataType<Entity, typeof method>[] = []
        const mapped = new Set<string>()
        const pk = metadata.columns.primary.name

        for (const data of rawData) {
            const mapKey = (
                (data.entityType ? `${data.entityType}:` : '') +
                data[pk]
            )
            if (mapped.has(mapKey)) continue

            const toMerge = rawData.filter(item => (
                item[pk] === data[pk] &&
                item.entityType === data.entityType
            ))

            const reducedData = {
                ...this.filterColumns<Entity>(toMerge[0]),
                ...this.filterRelations<Entity>(toMerge, metadata, method)
            }

            switch (method) {
                case "json": reduced.push(reducedData)
                    break

                // ------------------------------------------------------------

                case "entity": reduced.push(this.mapToEntity(
                    entityToMap ?? metadata.target!,
                    reducedData,
                    relation?.type === 'PolymorphicBelongsTo'
                ) as InstanceType<Entity>)
                    break
            }

            mapped.add(mapKey)
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private mapToEntity(target: Target, data: any, toSource: boolean): Entity {
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
            ? (target as StaticPolymorphicEntityTarget).build(data).toSourceEntity()
            : (target as StaticPolymorphicEntityTarget).build(data)
    }

    // ------------------------------------------------------------------------

    private filterColumns<Entity extends Target = T>(raw: MySQL2RawData): (
        RawData<Entity>
    ) {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        )) as RawData<Entity>
    }

    // ------------------------------------------------------------------------

    private filterRelations<Entity extends Target = T>(
        raw: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'json' | 'entity' = 'json'
    ): { [K: string]: MappedDataType<Entity, typeof method> } {
        return Object.fromEntries(Array.from(this.filterRelationsKeys(raw))
            .flatMap(key => {
                const toMerge = this.filterRelationsByKey(raw, key)
                if (toMerge.length === 0) return []

                const relation = metadata.relations.findOrThrow(key)
                const data = this.reduceMySQL2RawData(
                    toMerge,
                    MetadataHandler.targetMetadata(relation.relatedTarget),
                    method,
                    relation
                )

                return [[
                    key,
                    RelationMetadata.fillMethod(relation) === 'Many'
                        ? data
                        : data.shift()
                ]]
            })
        ) as { [K: string]: MappedDataType<Entity, typeof method> }
    }

    // ------------------------------------------------------------------------

    private filterRelationsByKey(
        raw: MySQL2RawData[],
        key: string
    ): MySQL2RawData[] {
        return raw
            .map(item => Object.fromEntries(Object.entries(item)
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

    private allNull(columns: RawData<T>): boolean {
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
    type RawData,
    type DataFillMethod
}