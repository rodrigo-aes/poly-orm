#!/usr/bin/env node

import 'reflect-metadata'
import Config from './Config'

import CLI, {
    InitCommander,
    MigrationCommander,
} from './CLI/index'

(async () => {
    await Config.load()
    new CLI({
        init: InitCommander,
        migration: MigrationCommander,
    })
})()