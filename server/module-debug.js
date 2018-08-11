"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const index_1 = require("../index");
const morgan = require("morgan");
if (config_1.default.debug) {
    index_1.default.use(morgan('dev', {
        skip: function (req, res) {
            return res.statusCode < 400;
        }, stream: process.stderr
    }));
    index_1.default.use(morgan('dev', {
        skip: function (req, res) {
            return res.statusCode >= 400;
        }, stream: process.stdout
    }));
}
