import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"
import EntityBuilder from "../../../EntityBuilder"
import { MetadataHandler } from "../../../../Metadata"

// Types
import type { Constructor } from "../../../../types"
import type { BaseEntity } from "../../../../Entities"
import type {
    CreateSQLBuilder,
    CreationAttributesOptions
} from "../../../../SQLBuilders"
import type { ExecOptions } from "../types"
import type { CreateResult, CreateCollectMapOptions } from "./types"

export default class CreateOperation extends OperationHandler {
    public static readonly fillMethod = 'One'

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    @Hooks.Create
    public static async exec<
        T extends BaseEntity,
        B extends CreateSQLBuilder<T>,
        M extends CreateCollectMapOptions<T> = never
    >(options: ExecOptions<T, B, M>): Promise<CreateResult<T, M>> {
        return EntityBuilder.build(
            options.target,
            await this.execAndMap(options)
        ) as CreateResult<T, M>
    }

    // Protecteds -------------------------------------------------------------
    protected static override async execAndMap(
        { target, sqlBuilder }: ExecOptions<any, any, any>
    ): Promise<CreationAttributesOptions<any>> {
        const { insertId, affectedRows } = await this.execQuery(
            target, sqlBuilder
        )

        return insertId
            ? this.fillPrimaries(
                target, sqlBuilder.mapAttributes(), insertId, affectedRows
            )
            : sqlBuilder.mapAttributes()
    }

    // Privates ---------------------------------------------------------------
    private static fillPrimaries<T extends BaseEntity>(
        target: Constructor<T>,
        attributes: CreationAttributesOptions<T>,
        insertId: number,
        affectedRows: number
    ): CreationAttributesOptions<T> {
        if (Array.isArray(attributes)) {
            const pk = MetadataHandler.targetMetadata(target).PK
            for (let r = 0; r < affectedRows; r++) (
                (attributes[r] as any)[pk] = insertId + r
            )
        }
        else (attributes as any)[MetadataHandler.targetMetadata(target).PK] = (
            insertId
        )

        return attributes
    }
}

export type {
    CreateResult,
    CreateCollectMapOptions
}
