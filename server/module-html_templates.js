"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const index_1 = require("../index");
const path = require("path");
index_1.default.set('views', path.join(config_1.default.rootDir, "views"));
