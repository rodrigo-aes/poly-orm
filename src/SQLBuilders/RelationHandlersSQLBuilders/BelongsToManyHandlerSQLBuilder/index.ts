import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

import { BaseEntity } from "../../../Entities"

// Procedures
import { SyncManyToMany } from "../../Procedures"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type { BelongsToManyMetadata } from "../../../Metadata"
import type { Entity, Constructor } from "../../../types"

export default class BelongsToManyHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends ManyRelationHandlerSQLBuilder<BelongsToManyMetadata, T, R> {
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
    public createForeingKeysSQL(relateds: R | R[]): string {
        return Array.isArray(relateds)
            ? this.bulkCreateForeignKeySQL(relateds)
            : this.createForeignKeySQL(relateds)
    }

    // ------------------------------------------------------------------------

    public attachSQL(...relateds: (R | any)[]) {
        return this.syncInsertSQL(this.extractSyncPrimaryKeys(relateds))
    }

    // ------------------------------------------------------------------------

    public detachSQL(...relateds: (R | any)[]) {
        return this.syncDeleteSQL(this.extractSyncPrimaryKeys(relateds))
    }

    // ------------------------------------------------------------------------

    public syncSQL(...relateds: (R | any)[]) {
        const primaryKeys: any[] = this.extractSyncPrimaryKeys(relateds)

        return SyncManyToMany.callSQL(
            this.syncInsertSQL(primaryKeys),
            this.syncDeleteSQL(primaryKeys)
        )
    }

    // ------------------------------------------------------------------------

    public syncWithoutDeleteSQL(...relateds: R[]) {
        return SyncManyToMany.callSQL(
            this.syncInsertSQL(this.extractSyncPrimaryKeys(relateds))
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `EXISTS (SELECT 1 FROM ${(
            this.relatedTable
        )} WHERE EXISTS (SELECT 1 FROM ${this.JT} WHERE ${(
            this.relatedForeignKey
        )} = ${this.relatedAlias}.${(
            this.relatedPrimary
        )} AND ${this.JTAlias}.${this.targetForeignKey} = ${(
            this.targetAlias
        )}.${this.targetPrimary}))`
    }

    // Privates ---------------------------------------------------------------
    private createForeignKeySQL(related: R): string {
        return `INSERT INTO ${this.JT} (${this.joinColumns}) VALUES (${(
            this.foreignKeysValues(related)
        )})`
    }

    // ------------------------------------------------------------------------

    private bulkCreateForeignKeySQL(relateds: R[]): string {
        return `INSERT INTO ${this.JT} (${this.joinColumns}) VALUES ${(
            this.bulkForeignKeysValues(relateds)
        )}`
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

    private foreignKeysValues(related: R): string {
        return `${this.targetPrimaryValueSQL}, ${(
            PropertySQLHelper.valueSQL(related[this.relatedPrimary])
        )}`
    }

    // ------------------------------------------------------------------------

    private bulkForeignKeysValues(relateds: R[]): string[] {
        return relateds.map(related => `(${this.foreignKeysValues(related)})`)
    }

    // ------------------------------------------------------------------------

    private extractSyncPrimaryKeys(relateds: R[]): any[] {
        return relateds.map(related => related instanceof BaseEntity
            ? (related as R)[this.relatedPrimary]
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