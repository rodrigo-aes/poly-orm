import { IntervalOption } from "./types"

export function now(): string {
    return "NOW()"
}

// ----------------------------------------------------------------------------

export function currentDate(): string {
    return "CURRENT_DATE()"
}

// ----------------------------------------------------------------------------

export function currentTime(): string {
    return "CURRENT_TIME()"
}

// ----------------------------------------------------------------------------

export function currentTimestamp(): string {
    return "CURRENT_TIMESTAMP()"
}

// ----------------------------------------------------------------------------

export function date(value: string): string {
    return `DATE(${value})`
}

// ----------------------------------------------------------------------------

export function time(value: string): string {
    return `TIME(${value})`
}

// ----------------------------------------------------------------------------

export function timestamp(value: string): string {
    return `TIMESTAMP(${value})`
}

// ----------------------------------------------------------------------------

export function year(value: string): string {
    return `YEAR(${value})`
}

// ----------------------------------------------------------------------------

export function month(value: string): string {
    return `MONTH(${value})`
}

// ----------------------------------------------------------------------------

export function day(value: string): string {
    return `DAY(${value})`
}

// ----------------------------------------------------------------------------

export function hour(value: string): string {
    return `HOUR(${value})`
}

// ----------------------------------------------------------------------------

export function minute(value: string): string {
    return `MINUTE(${value})`
}

// ----------------------------------------------------------------------------

export function second(value: string): string {
    return `SECOND(${value})`
}

// ----------------------------------------------------------------------------

export function interval(value: number, option: IntervalOption): string {
    return `INTERVAL ${value} ${option}`
}

// ----------------------------------------------------------------------------

export function dateAdd(date: string, value: string): string {
    return `DATE_ADD(${date}, ${value})`
}

// ----------------------------------------------------------------------------

export function dateSub(date: string, value: string): string {
    return `DATE_SUB(${date}, ${value})`
}

// ----------------------------------------------------------------------------

export function dateDiff(date1: string, date2: string): string {
    return `DATEDIFF(${date1}, ${date2})`
}

// ----------------------------------------------------------------------------

export function timeDiff(time1: string, time2: string): string {
    return `TIMEDIFF(${time1}, ${time2})`
}