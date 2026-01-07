import JoinColumnsMetadata, { JoinColumnMetadata } from "./JoinColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../types"
import type {
    JoinTableRelated,
    JoinTableRelatedsGetter,
    ResolvedJoinTableRelatedsTuple,
    JoinTableMetadataJSON
} from "./types"

export default class JoinTableMetadata {
    public columns!: JoinColumnsMetadata

    private _orderedRelateds?: ResolvedJoinTableRelatedsTuple

    constructor(
        public relateds: JoinTableRelatedsGetter,
        private _name?: string
    ) {
        this.buildColumns()
    }

    // Gettters ===============================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this._name ??= this.orderedRelateds
            .map(({ target }) => target.name.toLowerCase())
            .join('_')
    }

    // ------------------------------------------------------------------------

    public get targets(): [EntityTarget, EntityTarget] {
        return this.orderedRelateds.map(({ target }) => target) as (
            [EntityTarget, EntityTarget]
        )
    }

    // ------------------------------------------------------------------------

    public get dependencies(): [EntityTarget, EntityTarget] {
        return this.targets
    }

    // Privates ---------------------------------------------------------------
    private get orderedRelateds(): ResolvedJoinTableRelatedsTuple {
        return this._orderedRelateds ??= this.relateds()
            .map(({ target, options }) => ({
                target: this.resolveRelated(target),
                options
            }))
            .sort(
                ({ target }, b) => target.name.localeCompare(b.target.name)
            ) as ResolvedJoinTableRelatedsTuple
    }


    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getTargetColumn(target: EntityTarget): JoinColumnMetadata {
        return this.columns.getTargetColumn(target)
    }

    // ------------------------------------------------------------------------

    public toJSON(): JoinTableMetadataJSON {
        return {
            tableName: this.name,
            columns: this.columns.toJSON()
        }
    }

    // ------------------------------------------------------------------------

    public mergeRelateds(relateds: JoinTableRelatedsGetter) {
        const localRelateds = this.relateds()
        const incomingRelateds = relateds()

        this.rebuild(
            localRelateds.map(({ target, options }) => {
                target = this.resolveRelated(target)

                return ({
                    target,
                    options: {
                        ...options,
                        ...incomingRelateds
                            .find((rel) => rel.target === target)
                            ?.options
                    }
                })
            }) as ResolvedJoinTableRelatedsTuple
        )
    }

    // Privates ---------------------------------------------------------------
    private buildColumns() {
        return this.columns = new JoinColumnsMetadata(
            this,
            ...this.orderedRelateds.map(
                ({ target, options }) => new JoinColumnMetadata(this, {
                    referenced: () => target,
                    ...options
                })
            )
        )
    }

    // ------------------------------------------------------------------------

    private rebuild(relateds: ResolvedJoinTableRelatedsTuple): void {
        this.relateds = () => relateds
        this._orderedRelateds = undefined
        this.buildColumns()
    }

    // ------------------------------------------------------------------------

    private resolveRelated(related: Function): EntityTarget {
        try { return related() }
        catch (_) { }

        return related as EntityTarget
    }
}

export {
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
}