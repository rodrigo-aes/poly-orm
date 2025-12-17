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
    StaticEntityTarget,
    StaticPolymorphicEntityTarget,
    Constructor
} from "../../types"

import type {
    EntityData,
    JSONData,
    FillMethod,
    ParseOptions,
    ReduceOptions,
    FilterRelationsOptions
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MySQLDataHandler {
    constructor() {
        PolyORMException.Common.throw(
            'NOT_INSTANTIABLE_CLASS', this.constructor.name
        )
    }

    // Static Methods =======================================================
    // Publics ----------------------------------------------------------------
    public static parse<T extends Entity>(
        {
            target,
            raw,
            fillMethod,
            mapOptions,
            pagination,
            toSource,
        }: ParseOptions<T>
    ) {
        switch (typeof mapOptions?.mapTo) {
            case 'undefined': return this.entity(
                target, fillMethod, raw, toSource, pagination
            )

            // ----------------------------------------------------------------

            case "string": switch (mapOptions.mapTo) {
                case "entity": return this.entity(
                    target, fillMethod, raw, toSource, pagination
                )

                // ------------------------------------------------------------

                case "json": return this.json(target, raw, fillMethod)

                // ------------------------------------------------------------

                case "raw": return raw
            }

            // ----------------------------------------------------------------

            case "object": return this.entity(
                mapOptions.mapTo!, fillMethod, raw, toSource, pagination
            )
        }
    }

    // Privates ---------------------------------------------------------------
    private static entity<T extends Entity>(
        target: Constructor<T>,
        fillMethod: FillMethod,
        raw: any[],
        toSource: boolean = false,
        pagination?: PaginationInitMap
    ): EntityData<T> {
        return this.fill(
            target,
            fillMethod,
            this.reduce({ target, raw, toSource }),
            pagination
        )
    }

    // ------------------------------------------------------------------------
    private static json<T extends Entity>(
        target: Constructor<T>,
        raw: any[],
        fillMethod: FillMethod,
    ): JSONData<T> | JSONData<T>[] | null {
        switch (fillMethod) {
            case "One": return this.reduce({ target, raw, method: 'json' })[0]
                ?? null

            // ----------------------------------------------------------------

            case "Many": return this.reduce({ target, raw, method: 'json' })

            // ----------------------------------------------------------------

            default: throw new Error('Unreachable error')
        }
    }

    // ------------------------------------------------------------------------

    private static fill<T extends Entity>(
        target: Constructor<T>,
        method: FillMethod,
        data: T[],
        pagination?: PaginationInitMap
    ): EntityData<T> {
        switch (method) {
            case "One": return data[0] ?? null

            // ----------------------------------------------------------------

            case "Many": return CollectionsMetadataHandler.build(target, data)

            // ----------------------------------------------------------------

            case "Paginate": return PaginationMetadataHandler.build(
                target, pagination!, data
            )
        }
    }

    // ------------------------------------------------------------------------

    private static reduce<T extends Entity>(
        {
            raw,
            target,
            metadata,
            relation,
            method = 'entity',
            toSource = false
        }: ReduceOptions<T>
    ): any[] {
        if (raw.length === 0) return raw

        target ??= relation!.relatedTarget as Constructor<T>
        metadata ??= MetadataHandler.targetMetadata(target)

        raw = raw.map(item => this.removeAlias(item, this.firstAlias(raw)))
        const reduced: any[] = []
        const mapped = new Set<string>()

        for (const data of raw) {
            const mapKey = data.entityType ?? '' + data[metadata.PK]
            if (mapped.has(mapKey)) continue
            mapped.add(mapKey)

            const line = raw.filter(
                item => (
                    item[metadata.PK] === data[metadata.PK] &&
                    item.entityType === data.entityType
                )
            )

            switch (method) {
                case "json": reduced.push({
                    ...this.filterColumns(line[0]),
                    ...this.filterRelations({ line, metadata, method })
                })
                    break

                // ------------------------------------------------------------

                case "entity":
                    const entity = this.buildEntity(
                        target,
                        this.filterColumns(line[0]),
                        (relation as any)?.shouldMapToSource ?? toSource
                    )

                    reduced.push(entity.fill(this.filterRelations({
                        line, metadata, method, parent: entity
                    })))
                    break
            }
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private static buildEntity<T extends Entity>(
        target: Constructor<T>,
        data: any,
        toSource: boolean
    ): T {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                (target as StaticEntityTarget<any>).build(data)
            )

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                toSource
                    ? (target as StaticPolymorphicEntityTarget<any>)
                        .build(data)
                        .toSourceEntity()

                    : (target as StaticPolymorphicEntityTarget<any>)
                        .build(data)
            )

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }

    // ------------------------------------------------------------------------

    private static filterColumns(raw: any): any {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        ))
    }

    // ------------------------------------------------------------------------

    private static filterRelations(
        {
            line,
            metadata,
            method = 'json',
            parent
        }: FilterRelationsOptions
    ): any {
        return Object.fromEntries(
            Array
                .from(this.filterRelationsKeys(line))
                .flatMap(key => {
                    const relation = metadata.relations.findOrThrow(key)
                    return [[
                        key,
                        this.fillRelation(
                            method,
                            this.reduce({
                                raw: this.filterRelationsByKey(line, key),
                                metadata: MetadataHandler.targetMetadata(
                                    relation.relatedTarget
                                ),
                                relation,
                                method
                            }),
                            relation,
                            parent
                        )
                    ]]
                })
        )
    }

    // ------------------------------------------------------------------------

    private static fillRelation(
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

    private static filterRelationsByKey(
        raw: any[],
        key: string
    ): any[] {
        return raw
            .map(item => Object.fromEntries(
                Object
                    .entries(item)
                    .filter(([path]) => path.startsWith(`${key}_`))
            ))
            .filter(item => !this.isNull(item))
    }

    // ------------------------------------------------------------------------

    private static filterRelationsKeys(raw: any[]): Set<string> {
        return new Set(
            raw.flatMap(item => Object.keys(item).flatMap(
                key => key.includes('_')
                    ? key.split('_')[0]
                    : []
            ))
        )
    }

    // ------------------------------------------------------------------------

    private static isNull(columns: any): boolean {
        return Object
            .entries(columns)
            .map(([_, value]) => value)
            .every(value => value === null)
    }

    // ------------------------------------------------------------------------

    private static firstAlias(rawData: any): string {
        return Object.keys(rawData[0])[0].split('_')[0]
    }

    // ------------------------------------------------------------------------

    private static removeAlias(raw: any, alias: string): any {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.startsWith(`${alias}_`)
                ? [[key.replace(`${alias}_`, ''), value]]
                : []
        ))
    }
}

export {
    type FillMethod
}