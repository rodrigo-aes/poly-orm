// Utils
import Log from "../../utils/Log"

// Types
import type { PolyORMConfig } from "../types"

const defaultConfig: PolyORMConfig = {
    createConnections: async () => Log.out(
        '#[warning]"createConnections" #[default]config empty.'
    ),

    default: {
        ext: '.ts'
    },

    migrations: {
        dir: './Migrations',
        ext: '.ts'
    }
}

export default defaultConfig