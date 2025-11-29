import QueryBuilder from "../QueryBuilder"

// Types
import type {
    Constructor,
} from "../../types"
import type { BasePolymorphicEntity } from "../../Entities"

export default class PolymorphicEntityQueryBuilder<
    T extends BasePolymorphicEntity<any>
> extends QueryBuilder<T> {
    constructor(public target: Constructor<T>, alias?: string) {
        super(target, alias)
    }
}