import MetadataArray from "../../MetadataArray"

import Relation, {
    type RelationMetadata,
    type PolymorphicRelationMetadata,
    type ToOneRelationMetadata,
    type ToManyRelationMetadata,
    type RelationMetadataJSON,
    type RelatedEntitiesMap,

    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type HasOneOptions,
    type HasManyOptions,
    type HasOneThroughOptions,
    type HasManyThroughOptions,
    type BelongsToOptions,
    type BelongsToThroughOptions,
    type BelongsToManyOptions,
    type PolymorphicParentOptions,
    type PolymorphicChildOptions,

    type TargetGetter,
    type EntityTargetGetter,
    type PolymorphicTargetGetter
} from "./RelationMetadata"

// Types
import type { EntityTarget, StaticEntityTarget } from "../../../types"
import type { RelationsMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class RelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    public static readonly polymorphicTypes = [
        'PolymorphicHasOne',
        'PolymorphicHasMany',
        'PolymorphicBelongsTo'
    ]

    public static readonly polymorphicKeys: (
        keyof PolymorphicRelationMetadata
    )[] = ['name', 'relatedTarget', 'FK', 'TK', 'scope']

    constructor(public target: EntityTarget) {
        super(target)
        this.init()

        if ((this.target as StaticEntityTarget).INHERIT_POLYMORPHIC_RELATIONS)
            this.mergeParentPolymorphics()

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
        this.push(new Relation.HasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasMany(options: HasManyOptions) {
        this.push(new Relation.HasMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasOneThrough(options: HasOneThroughOptions) {
        this.push(new Relation.HasOneThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasManyThrough(options: HasManyThroughOptions) {
        this.push(new Relation.HasManyThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsTo(options: BelongsToOptions) {
        this.push(new Relation.BelongsTo(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToThrough(options: BelongsToThroughOptions) {
        this.push(new Relation.BelongsToThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToMany(options: BelongsToManyOptions) {
        this.push(new Relation.BelongsToMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasOne(options: PolymorphicChildOptions) {
        this.push(new Relation.PolymorphicHasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasMany(options: PolymorphicChildOptions) {
        this.push(new Relation.PolymorphicHasMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicBelongsTo(options: PolymorphicParentOptions) {
        this.push(new Relation.PolymorphicBelongsTo(this.target, options))
    }

    // Privates ---------------------------------------------------------------
    private mergeParentPolymorphics(): void {
        for (const poly of this.getParentPolymorphics()) (
            this.addPolymorphic(poly.type)(this.polymorphicOptions(poly))
        )
    }

    // ------------------------------------------------------------------------

    private getParentPolymorphics(): PolymorphicRelationMetadata[] {
        return this
            .getParentChilds()
            .filter(({ type }) => (
                RelationsMetadata.polymorphicTypes.includes(type)
            )) as (
                PolymorphicRelationMetadata[]
            )
    }

    // ------------------------------------------------------------------------

    private addPolymorphic(type: string) {
        switch (type) {
            case "PolymorphicHasOne": return this.addPolymorphicHasOne
            case "PolymorphicHasMany": return this.addPolymorphicHasMany
            case "PolymorphicBelongsTo": return this.addPolymorphicBelongsTo

            default: throw new Error('Unreacheable Error')
        }
    }

    // ------------------------------------------------------------------------

    private polymorphicOptions(relation: PolymorphicRelationMetadata): any {
        return Object.fromEntries(Object.entries(relation).filter(
            ([key]) => RelationsMetadata.polymorphicKeys.includes(key as any)
        ))
    }
}

export {
    Relation,

    type RelationMetadata,
    type PolymorphicRelationMetadata,
    type ToOneRelationMetadata,
    type ToManyRelationMetadata,
    type RelationsMetadataJSON,
    type RelationMetadataJSON,
    type RelatedEntitiesMap,

    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type HasOneOptions,
    type HasManyOptions,
    type HasOneThroughOptions,
    type HasManyThroughOptions,
    type BelongsToOptions,
    type BelongsToThroughOptions,
    type BelongsToManyOptions,
    type PolymorphicParentOptions,
    type PolymorphicChildOptions,

    type TargetGetter,
    type EntityTargetGetter,
    type PolymorphicTargetGetter
}