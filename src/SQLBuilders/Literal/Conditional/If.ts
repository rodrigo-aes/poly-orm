type Then = Omit<IfBuilder, 'if' | 'elseif' | 'else' | 'end'>
type Condition = Omit<IfBuilder, 'then'>

class IfBuilder {
    private sql: string[] = []

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public If(condition: string): Then {
        this.sql.push(`IF(${condition})`)
        return this
    }

    // ------------------------------------------------------------------------

    public ElseIf(condition: string): Then {
        this.sql.push(`ELSEIF(${condition})`)
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
        this.sql.push('END IF')
        return this.sql.join(' ')
    }
}

export default function If(condition: string): Then {
    return new IfBuilder().If(condition)
}