import MetadataArray from "../../MetadataArray"
import EntityMetadata, { RelationMetadata } from "../../EntityMetadata"

// Types
import type { PolymorphicEntityTarget, Constructor } from "../../../types"
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
        private sources: EntityMetadata[]
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
            .map(([name, { target, relation }]) => {
                const source = this.sources.find(s => s.target === target) ?? (
                    () => { throw new Error }
                )()

                const rel = source.relations.findOrThrow(relation)
                return rel.reply(this.target, name)
            })
    }

    // ------------------------------------------------------------------------

    private handleIncludedPolymorphics(): RelationMetadata[] {
        return Object
            .entries(this.includedPolymorphics)
            .flatMap(([name, options]) => {
                if (options.length) return []

                const relations = this.getOptionsRelations(options)
                this.verifyPolymorphicCompatibility(relations)

                return relations[0].reply(this.target, name)
            })
    }

    // ------------------------------------------------------------------------

    private getOptionsRelations(options: IncludePolymorphicRelationOptions): (
        RelationMetadata[]
    ) {
        return options.flatMap(({ target, relation }) =>
            this.sources.find(s => s.target === target)?.relations.findOrThrow(
                relation
            ) ?? (() => { throw new Error })()
        )
    }

    // ------------------------------------------------------------------------

    private verifyPolymorphicCompatibility(relations: RelationMetadata[]): (
        void
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
        options: IncludedCommonRelationOptions
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
        options: IncludePolymorphicRelationOptions
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