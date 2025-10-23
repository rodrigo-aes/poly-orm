import MetadataArray from "../../MetadataArray"
import JoinTableMetadata, {
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
} from "./JoinTableMetadata"

// Types
import type { EntityTarget } from "../../../types"
import type { JoinTablesMetadataJSON } from "./types"

export default class JoinTablesMetadata extends MetadataArray<
    JoinTableMetadata
> {
    constructor(
        public target?: EntityTarget,
        ...joinTables: JoinTableMetadata[]
    ) {
        super(target, ...joinTables)
        this.init()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof JoinTableMetadata)[] {
        return ['tableName']
    }

    // ------------------------------------------------------------------------

    protected override get SHOULD_MERGE(): boolean {
        return false
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'join-tables-metadata'
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected override register(): void {
        super.register()
        JoinTablesMetadata.all(...this)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static all(...tables: JoinTableMetadata[]): JoinTablesMetadata {
        return JoinTablesMetadata.findOrBuild(undefined, ...tables)
    }

    // ------------------------------------------------------------------------

    public static findByTarget(target: EntityTarget): JoinTableMetadata[] {
        return this.all().filter(({ targets }) => targets.includes(target))
    }

    // ------------------------------------------------------------------------

    public static makeAllUnique(): void {
        const uniques = new JoinTablesMetadata()

        for (const table of this.all()) {
            const existent = uniques.find(
                ({ tableName }) => tableName === table.tableName
            )

            if (existent) existent.mergeRelateds(table.relateds)
            else uniques.push(table)
        }

        Reflect.defineMetadata(this.KEY, uniques, this)
    }
}

export {
    JoinTableMetadata,
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTablesMetadataJSON,
    type JoinTableMetadataJSON
}