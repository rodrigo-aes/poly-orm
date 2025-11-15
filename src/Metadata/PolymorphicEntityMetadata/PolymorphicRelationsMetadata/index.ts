import MetadataArray from "../../MetadataArray"
import PolymorphicEntityMetadata from ".."
import EntityMetadata, { RelationMetadata } from "../../EntityMetadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types"
import type {
    IncludedCommonRelations,
    IncludedCommonRelationOptions,
    IncludedPolymorphicRelations,
    IncludePolymorphicRelationOptions
} from "./types"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../../../Errors"

export default class PolymorphicRelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    protected static readonly UNCLUDED_POLYMORPHIC_KEY: string = (
        'included-polymorphic-relations'
    )

    protected static readonly UNCLUDED_COMMON_KEY: string = (
        'included-common-relations'
    )

    private static readonly POLYMORPHIC_RELATIONS_TYPES = [
        'PolyrmorphicHasOne', 'PolymorphicHasMany', 'PolymorphicBelongsTo'
    ]

    constructor(
        public target: PolymorphicEntityTarget,
        private _sources?: EntityMetadata[]
    ) {
        super(target)
        this.fillIncluded()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof RelationMetadata)[] {
        return ['name', 'relatedTarget']
    }
    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_RELATION'
    }
    // Privates ---------------------------------------------------------------
    private get includedCommons(): IncludedCommonRelations {
        return PolymorphicRelationsMetadata.includedCommons(
            this.target
        )
    }

    // ------------------------------------------------------------------------

    private get includedPolymorphics(): IncludedPolymorphicRelations {
        return PolymorphicRelationsMetadata.includedPolymorphics(
            this.target
        )
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        return 'polymorphic-relations-metadata'
    }

    // Privates ---------------------------------------------------------------
    private get targetMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private get sources(): EntityMetadata[] {
        return this._sources ??= this.targetMetadata.sources.map(
            source => EntityMetadata.findOrThrow(source)
        )

    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private fillIncluded(): void {
        this.push(
            ...this.handleIncludedCommons(),
            ...this.handleIncludedPolymorphics()
        )
    }

    // ------------------------------------------------------------------------

    private handleIncludedCommons(): RelationMetadata[] {
        return Object
            .entries(this.includedCommons)
            .map(([name, options]) => this.sources
                .find(source => source.target === options.target)
                ?.relations.findOrThrow(name)
                .reply(this.target, name)

                ?? (() => { throw new Error })()
            )
    }

    // ------------------------------------------------------------------------

    private handleIncludedPolymorphics(): RelationMetadata[] {
        return Object
            .entries(this.includedPolymorphics)
            .flatMap(([name, options]) => {
                return this.verifyPolymorphicCompatibility(
                    options
                        ? options.map(({ target, relation }) => EntityMetadata
                            .findOrThrow(target)
                            .relations
                            .findOrThrow(relation)
                        )
                        : this.sources.map(({ relations }) =>
                            relations.findOrThrow(name)
                        )
                )[0]?.reply(this.target, name)
                    ?? []
            })
    }

    // ------------------------------------------------------------------------

    private verifyPolymorphicCompatibility(relations: RelationMetadata[]): (
        RelationMetadata[]
    ) {
        const [{ type, relatedTarget, name }] = relations

        if (
            (
                !PolymorphicRelationsMetadata
                    .POLYMORPHIC_RELATIONS_TYPES.includes(type)
            ) || (
                !relations.every(rel => (
                    rel.type === type && rel.relatedTarget === relatedTarget
                ))
            )
        ) (
            PolyORMException.Metadata.throw(
                'IMCOMPATIBLE_POLYMORPHIC_RELATIONS',
                relations.map(({ type }) => type),
                name,
                this.target.name
            )
        )

        return relations
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static includedCommons(target: PolymorphicEntityTarget): (
        IncludedCommonRelations
    ) {
        return Reflect.getOwnMetadata(this.UNCLUDED_COMMON_KEY, target)
            ?? {}
    }

    // ------------------------------------------------------------------------

    public static includedPolymorphics(target: PolymorphicEntityTarget): (
        IncludedPolymorphicRelations
    ) {
        return Reflect.getOwnMetadata(this.UNCLUDED_POLYMORPHIC_KEY, target)
            ?? {}
    }

    // ------------------------------------------------------------------------

    public static includeCommon(
        target: PolymorphicEntityTarget,
        name: string,
        options?: IncludedCommonRelationOptions
    ): void {
        Reflect.defineMetadata(
            this.UNCLUDED_COMMON_KEY,
            { ...this.includedCommons(target), [name]: options },
            target
        )
    }

    // ------------------------------------------------------------------------

    public static includePolymorphic(
        target: PolymorphicEntityTarget,
        name: string,
        options?: IncludePolymorphicRelationOptions
    ): void {
        Reflect.defineMetadata(
            this.UNCLUDED_POLYMORPHIC_KEY,
            { ...this.includedPolymorphics(target), [name]: options },
            target
        )
    }
}

export {
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions
}