"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config_1 = require("./config");
exports.app = express();
exports.default = exports.app;
// Initialization
require("./server/module-debug");
require("./server/module-view_engine");
require("./server/module-encoding_handler");
require("./server/module-session");
require("./server/module-public_files");
require("./server/module-html_templates");
require("./server/dev/module-init_pages");
require("./server/pages/module-default_page");
require("./server/pages/module-pages");
require("./server/pages/module-error_404");
require("./server/services/module-login_logout");
require("./server/services/module-is_admin");
/* ************************************
 *
 * START LISTENING
 *
 * ************************************/
exports.app.listen(config_1.default.port, () => console.log('Listening on port ' + config_1.default.port + '!'));
