#!/bin/node

const {app,BrowserWindow} = require('electron');
const ipc                 = require('electron').ipcMain;
const sqlite3             = require('sqlite3').verbose();
const fs                  = require('fs');
const path                = require('path');

const dwb = Object();

dwb.Presentable = class {

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

dwb.Database = class {

    // Constructor
    //    path -> Path to the PostgreSQL database
    constructor(path) {
        this.path = path;
        this.db = this.connect(path);
    }

    // connect
    //    path -> Path to the PostgreSQL database
    // Connects to an existing database at the specified location on the system, creates it if necessary
    async connect(path) {
        let ret = await new sqlite3.Database(path, err => {
            if (err) console.error(`[E] Connection to database "${path}" failed:\n    > ${err.message}`);
            else console.log(`[I] Connection to database "${path} successful"`);
        });
        return ret;
    }

    // sanityCheck() (TODO)
    //    Performs a sanity check on the database.
    get sanityCheck() {}

    async getPresentable(id) {
        if (!db) connect(this.path);

        let sql = [
            `SELECT Name FROM 'displays' WHERE ID = "${id}"`,
            `SELECT * FROM 'presentables' WHERE display_id = "${id}"`
        ], ret = Object();

        await this.db.get(sql[0], [], (err, row) => {
            if (err) console.error(`[E] Fetching display with ID "${id}" failed:\n    > ${err.message}`);
            ret.name = row.Name;
        });
        await this.db.each(sql[1], [], (err, row) => {
            if (err) console.error(`[E] Fetching presentable with display_id "${id}" failed:\n    > ${err.message}`);
            ret.presentable = row;
        });

        return ret;
    }
}

db = new dwb.Database("./test2.db");

db.getPresentable(0);

debugger;

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