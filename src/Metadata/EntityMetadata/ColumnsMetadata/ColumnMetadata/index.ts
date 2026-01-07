// Metadata
import EntityMetadata from "../.."
import DataType from "../../DataType"
import HooksMetadata from "../../HooksMetadata"

// Objects
import ForeignKeyReferences, {
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencesJSON
} from "./ForeignKeyReferences"


// Symbols
import { CurrentTimestamp } from "../../../../SQLBuilders"

// Types
import type { EntityTarget } from "../../../../types"
import type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignIdConfig,
    PolymorphicForeignIdConfig,
    PolymorphicTypeKeyRelateds,
    ColumnMetadataJSON
} from "./types"

export default class ColumnMetadata {
    public primary?: boolean
    public unique?: boolean
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean

    public references?: ForeignKeyReferences
    public pattern?: ColumnPattern

    constructor(
        public target: EntityTarget,
        public name: string,
        public dataType: DataType,
        public config?: ColumnConfig
    ) {
        if (config) Object.assign(this, config)
        this.syncWithDataType()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public defineForeignKey(initMap: ForeignKeyReferencesInitMap): this {
        this.isForeignKey = true
        this.references = new ForeignKeyReferences(
            this.target,
            this.name,
            initMap
        )

        return this
    }

    // ------------------------------------------------------------------------

    public toJSON(): ColumnMetadataJSON {
        return {
            dataType: this.dataType.toJSON(),
            references: this.references?.toJSON(),
            name: this.name,
            length: this.length,
            nullable: this.nullable,
            defaultValue: this.defaultValue,
            unique: this.unique,
            primary: this.primary,
            autoIncrement: this.autoIncrement,
            unsigned: this.unsigned,
            isForeignKey: this.isForeignKey,
            pattern: this.pattern,
        }
    }

    // Privates ---------------------------------------------------------------
    private syncWithDataType(): void {
        this.syncLength(this.dataType)
    }

    // ------------------------------------------------------------------------

    private syncLength(dataType: any): void {
        this.length = this.length ?? (
            typeof dataType.length === 'number'
                ? dataType.length
                : undefined
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildPattern(
        target: EntityTarget,
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ): ColumnMetadata {
        switch (pattern) {
            case 'id': return this.buildIdColumn(target, name)

            // ----------------------------------------------------------------

            case 'polymorphic-id': return this.buildPolymorphicIdColumn(
                target, name
            )

            // ----------------------------------------------------------------

            case 'foreign-id': return this.buildForeignIdcolumn(
                target, name, ...(rest as [ForeignIdConfig])
            )

            // ----------------------------------------------------------------

            case 'polymorphic-foreign-id': return (
                this.buildPolymorphicForeignId(
                    target,
                    name,
                    ...(rest as [PolymorphicForeignIdConfig])
                )
            )

            // ----------------------------------------------------------------

            case "polymorphic-type-key": return (
                this.buildPolymorphicTypeKey(target, name, rest)
            )

            // ----------------------------------------------------------------

            case "created-timestamp": return this.buildCreateDateColumn(
                target, name
            )

            // ----------------------------------------------------------------

            case "updated-timestamp": return this.buildUpdateDateColumn(
                target, name
            )
        }
    }

    // ------------------------------------------------------------------------

    public static buildIdColumn(target: EntityTarget, name: string) {
        return new ColumnMetadata(
            target,
            name,
            DataType.INT('BIG'),
            {
                primary: true,
                unsigned: true,
                autoIncrement: true,
                nullable: false,
                pattern: 'id'
            }
        )
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicIdColumn(
        target: EntityTarget,
        name: string
    ): ColumnMetadata {
        return new ColumnMetadata(
            target,
            name,
            DataType.VARCHAR(),
            {
                primary: true,
                unique: true,
                nullable: false,
                pattern: 'polymorphic-id',
            }
        )

    }

    // ------------------------------------------------------------------------

    public static buildForeignIdcolumn(
        target: EntityTarget,
        name: string,
        config: ForeignIdConfig
    ) {
        return new ColumnMetadata(
            target,
            name,
            DataType.INT('BIG'),
            {
                isForeignKey: true,
                unsigned: true,
                pattern: 'foreign-id'
            }
        )
            .defineForeignKey({ constrained: true, ...config })
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicForeignId(
        target: EntityTarget,
        name: string,
        config: PolymorphicForeignIdConfig
    ) {
        return new ColumnMetadata(
            target,
            name,
            DataType.VARCHAR(),
            {
                isForeignKey: true,
                pattern: 'polymorphic-foreign-id'
            }
        )
            .defineForeignKey({ constrained: false, ...config })
    }

    // ------------------------------------------------------------------------

    public static buildPolymorphicTypeKey(
        target: EntityTarget,
        name: string,
        relateds: PolymorphicTypeKeyRelateds
    ) {
        return new ColumnMetadata(
            target,
            name,
            DataType.ENUM(...relateds.map(({ name }) => name)),
            {
                pattern: 'polymorphic-type-key'
            }
        )
    }

    // ------------------------------------------------------------------------

    public static buildCreateDateColumn(target: EntityTarget, name: string) {
        return new ColumnMetadata(
            target,
            name,
            DataType.TIMESTAMP(),
            {
                nullable: false,
                defaultValue: CurrentTimestamp,
                pattern: 'created-timestamp',
            }
        )
    }

    // ------------------------------------------------------------------------

    public static buildUpdateDateColumn(target: EntityTarget, name: string) {
        HooksMetadata.findOrBuild(target).addUpdatedTimestampMetadata()

        return new ColumnMetadata(
            target,
            name,
            DataType.TIMESTAMP(),
            {
                nullable: false,
                defaultValue: CurrentTimestamp,
                pattern: 'updated-timestamp',
            }
        )
    }
}

export type {
    SQLColumnType,
    ColumnPattern,
    ColumnConfig,
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignIdConfig,
    PolymorphicForeignIdConfig,
    PolymorphicTypeKeyRelateds,
    ColumnMetadataJSON,
    ForeignKeyReferencesJSON
}