type Then = Omit<CaseBuilder, 'When' | 'Else' | 'End'>
type Condition = Omit<CaseBuilder, 'Then'>


class CaseBuilder {
    private sql: string[] = []

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public When(condition: string): Then {
        this.sql.push(`WHEN ${condition}`)
        return this
    }

    // ------------------------------------------------------------------------

    public Then(action: string): Condition {
        this.sql.push(`THEN ${action}`)
        return this
    }

    // ------------------------------------------------------------------------

    public Else(action: string): string {
        this.sql.push(`ELSE ${action}`)
        return this.End()
    }

    // ------------------------------------------------------------------------

    public End(): string {
        this.sql.push('END')
        return this.sql.join(' ')
    }
}

export default function Case(condition: string): Then {
    return new CaseBuilder().When(condition)
}
