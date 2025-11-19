import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

import { BaseEntity } from "../../../Entities"

// Procedures
import { SyncManyToMany } from "../../Procedures"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { BelongsToManyMetadata } from "../../../Metadata"
import type { EntityTarget } from "../../../types"

export default class BelongsToManyHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelationHandlerSQLBuilder<
    BelongsToManyMetadata,
    Target,
    Related
> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // ------------------------------------------------------------------------

    protected override get relatedTable(): string {
        return `${this.metadata.relatedTable} ${this.relatedAlias}`
    }

    // Privates ---------------------------------------------------------------
    private get JT(): string {
        return this.metadata.JT
    }

    // ------------------------------------------------------------------------

    private get JTAlias(): string {
        return this.metadata.JTAlias
    }

    // ------------------------------------------------------------------------

    private get targetForeignKey(): string {
        return this.metadata.parentFKname
    }

    // ------------------------------------------------------------------------

    private get relatedForeignKey(): string {
        return this.metadata.relatedFKName
    }

    // ------------------------------------------------------------------------

    private get joinColumns(): string {
        return `${this.metadata.parentForeignKey.name}, ${(
            this.metadata.relatedForeignKey.name
        )}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createForeingKeysSQL(
        relateds: InstanceType<Related> | InstanceType<Related>[]
    ): [string, any[]] {
        return Array.isArray(relateds)
            ? this.bulkCreateForeignKeySQL(relateds)
            : this.createForeignKeySQL(relateds)
    }

    // ------------------------------------------------------------------------

    public attachSQL(...relateds: (InstanceType<Related> | any)[]) {
        return this.syncInsertSQL(this.extractSyncPrimaryKeys(relateds))
    }

    // ------------------------------------------------------------------------

    public detachSQL(...relateds: (InstanceType<Related> | any)[]) {
        return this.syncDeleteSQL(this.extractSyncPrimaryKeys(relateds))
    }

    // ------------------------------------------------------------------------

    public syncSQL(...relateds: (InstanceType<Related> | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)

        return SyncManyToMany.callSQL(
            this.syncInsertSQL(primaryKeys),
            this.syncDeleteSQL(primaryKeys)
        )
    }

    // ------------------------------------------------------------------------

    public syncWithoutDeleteSQL(...relateds: (InstanceType<Related> | any)[]) {
        return SyncManyToMany.callSQL(
            this.syncInsertSQL(this.extractSyncPrimaryKeys(relateds))
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `EXISTS (SELECT 1 FROM ${this.relatedTable} WHERE EXISTS (
            SELECT 1 FROM ${this.JT}
            WHERE ${this.relatedForeignKey} = ${this.relatedAlias}.${(
                this.relatedPrimary
            )}
            AND ${this.JTAlias}.${this.targetForeignKey} = ${(
                this.targetAlias
            )}.${this.targetPrimary}
        ))`
    }

    // Privates ---------------------------------------------------------------
    private createForeignKeySQL(related: InstanceType<Related>): (
        [string, any[]]
    ) {
        return [
            SQLStringHelper.normalizeSQL(`
                INSERT INTO ${this.JT} 
                (${this.joinColumns})
                VALUES (?, ?)
            `),
            this.foreignKeysValues(related)
        ]
    }

    // ------------------------------------------------------------------------

    private bulkCreateForeignKeySQL(relateds: InstanceType<Related>[]): (
        [string, any[][]]
    ) {
        return [
            SQLStringHelper.normalizeSQL(`
                INSERT INTO ${this.JT}
                (${this.joinColumns})
                VALUES ${'(?, ?), '.repeat(relateds.length)}
            `),
            relateds.map(related => this.foreignKeysValues(related))
        ]
    }

    // ------------------------------------------------------------------------

    private syncInsertSQL(primaryKeys: any[]): string {
        return `INSERT IGNORE INTO ${this.JT} (${this.joinColumns}) VALUES (${(
            this.syncInsertValuesSQL(primaryKeys)
        )})`
    }

    // ------------------------------------------------------------------------

    private syncDeleteSQL(primaryKeys: any[]): string {
        return `DELETE FROM ${this.JT} WHERE ${this.targetForeignKey} = ${(
            this.targetPrimaryValue
        )} AND ${this.relatedForeignKey} NOT IN (${(
            this.primaryKeysInSQL(primaryKeys)
        )})`
    }

    // ------------------------------------------------------------------------

    private foreignKeysValues(related: InstanceType<Related>): any[] {
        return [this.targetPrimaryValue, related[this.relatedPrimary]]
    }

    // ------------------------------------------------------------------------

    private extractSyncPrimaryKeys(
        relateds: (InstanceType<Related> | any)[]
    ): any[] {
        return relateds.map(related =>
            related instanceof BaseEntity
                ? (related as InstanceType<Related>)[this.relatedPrimary]
                : related
        )
    }

    // ------------------------------------------------------------------------

    private syncInsertValuesSQL(primaryKeys: any[]): string {
        return primaryKeys
            .map(key => `(${this.targetPrimaryValue}, ${(
                PropertySQLHelper.valueSQL(key)
            )})`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private primaryKeysInSQL(primaryKeys: any[]): string {
        return primaryKeys
            .map(key => PropertySQLHelper.valueSQL(key))
            .join(', ')
    }
}