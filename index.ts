import express = require('express')
import config from "./config"

export const app = express()
export default app

// Initialization
import "./server/module-debug"
import "./server/module-view_engine"
import "./server/module-encoding_handler"
import "./server/module-session"
import "./server/module-public_files"
import "./server/module-html_templates"

import "./server/dev/module-init_pages"

import "./server/pages/module-default_page"
import "./server/pages/module-pages"
import "./server/pages/module-error_404"

import "./server/services/module-login_logout"
import "./server/services/module-is_admin"

/* ************************************
 * 
 * START LISTENING
 * 
 * ************************************/
app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'))
