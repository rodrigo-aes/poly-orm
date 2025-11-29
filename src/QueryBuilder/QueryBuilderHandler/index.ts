import type { PartialQueryBuilder, QueryHandler } from "../types"

export default class QueryBuilderHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static handle<
        QB extends PartialQueryBuilder<any>,
        H extends QueryHandler<any, QB>
    >(qb: QB, handler: H): QB {
        handler(qb as any)
        return qb
    }
}