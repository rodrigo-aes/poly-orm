import 'reflect-metadata'
import './Errors'
import Config from './Config'

import CLI, {
    MigrationCommander
} from './CLI/index'

(async () => {
    await Config.load()
    new CLI({
        migrations: MigrationCommander
    })
})()