import express = require('express')
import config from "./config"

export const app = express()
export default app

import "./server/module-debug"
import "./server/module-config"

import "./server/dev/module-init_pages"

import "./server/pages/module-default_page"
import "./server/pages/module-pages"
import "./server/pages/module-error_404"

import "./server/services/module-login_logout"
import "./server/services/module-is_admin"

app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
