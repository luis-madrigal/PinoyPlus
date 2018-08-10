"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const express = require("express");
index_1.app.use(express.json());
index_1.app.use(express.urlencoded());
