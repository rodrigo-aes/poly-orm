import 'reflect-metadata'
import Config from '../Config'
import {
    CLI,
    InitCommand,
    MigrationCommand,
} from '../CLI'

await Config.load()

new CLI({
    init: InitCommand,
    migration: MigrationCommand,
})