import MetadataArray from "../../MetadataArray"

import RelationMetadata, {
    type RelationJSON,
    type RelationMetadataType,
    type OneRelationMetadataType,
    type ManyRelationMetadatatype,

    HasOneMetadata,
    type HasOneOptions,
    type HasOneRelatedGetter,

    HasManyMetadata,
    type HasManyOptions,
    type HasManyRelatedGetter,

    HasOneThroughMetadata,
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    HasManyThroughMetadata,
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    BelongsToMetadata,
    type BelongToOptions,
    type BelongsToRelatedGetter,

    BelongsToThroughMetadata,
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type RelatedEntitiesMap,
    type PolymorphicRelation
} from "./RelationMetadata"

import type { RelationsMetadataJSON } from "./types"
import type { EntityTarget, StaticEntityTarget } from "../../../types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class RelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    constructor(public target: EntityTarget) {
        super(target)
        this.init()

        if (
            (this.target as StaticEntityTarget).INHERIT_POLYMORPHIC_RELATIONS
        ) this.mergeParentPolymorphicRelations()

    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof RelationMetadata)[] {
        return ['name', 'relatedTarget']
    }

    // ------------------------------------------------------------------------

    protected override get SHOULD_MERGE(): boolean {
        return false
    }

    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_RELATION'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'relations-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public addHasOne(options: HasOneOptions) {
        this.push(new RelationMetadata.HasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasMany(options: HasManyOptions) {
        this.push(new RelationMetadata.HasMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasOneThrough(options: HasOneThroughOptions) {
        this.push(new RelationMetadata.HasOneThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasManyThrough(options: HasManyThroughOptions) {
        this.push(new RelationMetadata.HasManyThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsTo(options: BelongToOptions) {
        this.push(new RelationMetadata.BelongsTo(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToThrough(options: BelongsToThroughOptions) {
        this.push(new RelationMetadata.BelongsToThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToMany(options: BelongsToManyOptions) {
        this.push(new RelationMetadata.BelongsToMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasOne(options: PolymorphicChildOptions) {
        this.push(new RelationMetadata.PolymorphicHasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasMany(options: PolymorphicChildOptions) {
        this.push(
            new RelationMetadata.PolymorphicHasMany(this.target, options)
        )
    }

    // ------------------------------------------------------------------------

    public addPolymorphicBelongsTo(options: PolymorphicParentOptions) {
        this.push(
            new RelationMetadata.PolymorphicBelongsTo(this.target, options)
        )
    }

    // Privates ---------------------------------------------------------------
    private mergeParentPolymorphicRelations(): void {
        for (const poly of this.getParentPolymorphicRelations()) (
            this.addPolymorphicRelation(poly.type)(
                this.extractPolymorphicRelationOptions(poly)
            )
        )
    }

    // ------------------------------------------------------------------------

    private getParentPolymorphicRelations(): PolymorphicRelation[] {
        const types = [
            'PolymorphicHasOne',
            'PolymorphicHasMany',
            'PolymorphicBelongsTo'
        ]

        return this.getParentChilds()
            .filter(({ type }) => types.includes(type)) as (
                PolymorphicRelation[]
            )
    }

    // ------------------------------------------------------------------------

    private addPolymorphicRelation(type: string) {
        switch (type) {
            case "PolymorphicHasOne": return this.addPolymorphicHasOne
            case "PolymorphicHasMany": return this.addPolymorphicHasMany
            case "PolymorphicBelongsTo": return this.addPolymorphicBelongsTo

            default: throw new Error('Unreacheable Error')
        }
    }

    // ------------------------------------------------------------------------

    private extractPolymorphicRelationOptions(relation: PolymorphicRelation): (
        any
    ) {
        const keys = ['name', 'related', 'foreignKey', 'typeKey', 'scope']
        return Object.fromEntries(Object.entries(relation).filter(
            ([key]) => keys.includes(key))
        )
    }
}

export {
    RelationMetadata,
    type OneRelationMetadataType,
    type ManyRelationMetadatatype,
    type RelationMetadataType,

    HasOneMetadata,
    type HasOneOptions,
    type HasOneRelatedGetter,

    HasManyMetadata,
    type HasManyOptions,
    type HasManyRelatedGetter,

    HasOneThroughMetadata,
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    HasManyThroughMetadata,
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    BelongsToMetadata,
    type BelongToOptions,
    type BelongsToRelatedGetter,

    BelongsToThroughMetadata,
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type RelatedEntitiesMap,

    type RelationJSON,
    type RelationsMetadataJSON,
}