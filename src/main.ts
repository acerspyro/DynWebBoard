/// <reference path="globals.d.ts" />

import * as path from 'path';

import Backend from './backend/backend';

var __root = path.resolve(__dirname);

function init() {
    Backend();
}

function quit() {

}