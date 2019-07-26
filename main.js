#!/bin/node

const {app,BrowserWindow} = require('electron');
const ipc                 = require('electron').ipcMain;
const sqlite3             = require('sqlite3').verbose();
const fs                  = require('fs');
const path                = require('path');

const dynWebBoard = Object();

dynWebBoard.Presentable = class {

    // Constructor
    //    type    -> Type,
    //    config  -> Configuration Object: {
    //        uri:        URI of the presentable, either a URL or a file path
    //        duration:   Duration of the presentable, in seconds (Default: 20s)
    //        wait:       Time allocated to load the presentable, make longer for slower websites (Default: 10s)
    //        transition: (TODO) Transition used when the presentable moves on-screen (Default: fade)
    //    }
    constructor(type, config) {
        this.type   = (Object.keys(this.types).find(e => e == type) ? type : new TypeError('Invalid Presentable type'));
        this.config = {
            uri:        (typeof config.uri == 'string' ? config.uri : new Error('Invalid uri, expected string')),
            duration:   (typeof config.duration == 'number' ? config.duration : undefined),
            wait:       (typeof config.wait == 'number' ? config.wait : undefined),
            transition: (Object.keys(this.types).find(e => e == config.transition) ? config.transition : undefined)
        };

        // Implement failure procedure as fallback?
    }

    get types() {
        return {
            WEBSITE: 0,
            WEBPAGE: 1,
            IMAGE:   2, // Includes GIFs and WebMs
            VIDEO:   3
        };
    }
    
    get transitions() {
        return {
            FADE: 0
        };
    }
}

dynWebBoard.sql = {
    GetDisplayByID:             `SELECT * FROM displays WHERE id = ?`,
    GetProfileByID:             `SELECT * FROM profiles WHERE id = ?`,
    GetPresentableByID:         `SELECT * FROM presentables WHERE id = ?`,
    GetPresentablesByProfileID: `SELECT * FROM presentables WHERE profile_id = ?`,
    CreateDisplaysTable: `
        CREATE TABLE IF NOT EXISTS displays (
            id          INT         PRIMARY KEY,
            profile_id  INT         NOT NULL,
            name        VARCHAR(48) NOT NULL
        )`,
    CreateProfilesTable: `
        CREATE TABLE IF NOT EXISTS profiles (
            id          INT         PRIMARY KEY,
            name        VARCHAR(48) NOT NULL
        )`,
    CreatePresentablesTable: `
        CREATE TABLE IF NOT EXISTS presentables (
            id          INT         PRIMARY KEY,
            profile_id  INT         NOT NULL,
            uri         TEXT        NOT NULL,
            type        INT         NOT NULL,
            parameters  TEXT
        )`
}

dynWebBoard.Database = class {

    // Constructor
    //    path -> Path to the SQLite database
    constructor(path) {
        this.path = path;
    }

    // connect
    //    path -> Path to the SQLite database
    // Connects to an existing database at the specified location on the system, creates it if necessary
    async connect(path) {
        this.db = new sqlite3.Database(path, err => {
            if (err) console.error(`[E] Connection to database "${path}" failed:\n    > ${err.message}`);
            else console.log(`[I] Connection to database "${path} successful"`);
        }); let sanity = await this.sanityCheck();

        return (sanity ? this.db : sanity);
    }

    // sanityCheck()
    //    Performs a sanity check on the database.
    async sanityCheck() {
        let sane = true;

        let checkerr = err => {
            if (err) {
                console.error(`[E] sanityCheck failed:\n    > ${err}`);
                sane = false; // Table did not exist and could not set table, unset sane flag
            }
        };

        // Check if tables exist, if not, create them.
        await this.db.run(dynWebBoard.sql.CreateDisplaysTable, checkerr);
        await this.db.run(dynWebBoard.sql.CreateProfilesTable, checkerr);
        await this.db.run(dynWebBoard.sql.CreatePresentablesTable, checkerr);

        // TODO: Check if table columns are valid, if not, adjust them

        return sane;
    }

    // Getter generator
    getByID(id, queryName, method = 'each') {
        if (!this.db) this.connect(this.path);
        let ret = Object();

        this.db[method](dynWebBoard.sql[queryName], id, (err, row) => {
            if (err) console.error(`[E] ${queryName} "${id}" failed:\n    > ${err.message}`);
            ret = row;
        });

        return ret;
    }

    // Define getters

    getDisplayByID(id) { return this.getByID(id, 'GetDisplayByID'); }
    getProfileByID(id) { return this.getByID(id, 'GetProfileByID'); }
    getPresentableByID(id) { return this.getByID(id, 'GetPresentableByID'); }
    getPresentablesByProfileID(id) { return this.getByID(id, 'GetPresentablesByProfileID', 'get'); }
}

db = new dynWebBoard.Database("./test2.db");

db.getPresentableByID(0);

/*
global.contentConfig = null;
global.currentViewID = 0;

app.on('ready', () => {

    // Create main window
    global.appWindow = new BrowserWindow({
        frame: false,
        kiosk: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Handle window closing
    global.appWindow.on('close', () => {
        global.appWindow = null; // Clear memory for window
        // Will NodeJS automatically return?
    });

    // Load our main content (./index.html)
    global.appWindow.loadURL(path.join('file://', __dirname, 'web/display.html'));

    // Initialize the window
    global.appWindow.show();

    loadContentConfig = () => {
        oldPackage = global.contentConfig;

        try {
            if (oldPackage != null && oldPackage != global.contentConfig) {
                // Do something... For now, manually restart the program.
            }
            global.contentConfig = require('./sites.json');
        } catch {
            if (global.contentConfig == null) {
                console.log('ERR: Cannot start due to invalid configuration. Please check your package.json!');
                process.exit();
            } else {
                console.log('WARN: Current configuration invalid, keeping known good configuration.');
                global.contentConfig = oldPackage;
            }
        }
    }

    loadContents = (confID) => {
        global.appWindow.webContents.send('loadContent', {
            "id": confID,
            "conf": global.contentConfig
        });
    }

    ipc.on('appReady', () => {
        t = () => {
            loadContentConfig();
            loadContents(global.currentViewID);
            global.currentViewID = (global.currentViewID < global.contentConfig.length-1 ? global.currentViewID+1 : 0);
        };
        // Load first website in app
        t(currentViewID);

        setInterval(t, global.contentConfig[global.currentViewID].duration*1000);
    });

});

*/