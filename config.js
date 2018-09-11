"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    debug: true,
    port: process.env.port || process.env.PORT || 3000,
    adminAccount: "admin@pinoyplus",
    adminServerUrl: "http://104.215.149.132:9000/",
    chatServerUrl: "http://104.215.149.132:4000/",
    // adminServerUrl: "http://localhost:5280/api/",
    // chatServerUrl: "http://localhost:5280/bosh/",
    chatHost: "pinoyplus",
    sessionSecret: "asdpfodkdpvk134po1kp24okfpokd-v0ss-wmwkemld",
    rootDir: __dirname
};
exports.default = exports.config;
