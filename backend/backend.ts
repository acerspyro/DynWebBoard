const {app,BrowserWindow} = require('electron');
const ipc                 = require('electron').ipcMain;
const fs                  = require('fs');
const path                = require('path');

function Presentable(type: number, config: { uri: any; duration: any; wait: any; transition: any; }) {

    enum Type { // Place in prototype?
        WEBSITE = 0,
        WEBPAGE = 1,
        IMAGE   = 2, // Includes GIFs and WebMs
        VIDEO   = 3
    };

    enum TransitionStyle {
        NONE    = 0,
        FADE    = 1,
        SLIDE   = 2,
        SHIFT   = 3
    };

    enum TransitionMeta {
        UP      = 0,
        DOWN    = 1,
        LEFT    = 2,
        RIGHT   = 3
    };

    enum TransitionTimingFunction { // Same as their CSS counterpart
        EASE        = 0,
        LINEAR      = 1,
        EASE_IN     = 2,
        EASE_OUT    = 3,
        EASE_IN_OUT = 4
    };

    //    type    -> Type,
    //    config  -> Configuration Object: {
    //        uri:        URI of the presentable, either a URL or a file path
    //        duration:   Duration of the presentable, in seconds (Default: 20s)
    //        wait:       Time allocated to load the presentable, make longer for slower websites (Default: 10s)
    //        transition: (TODO) Transition used when the presentable moves on-screen (Default: fade)
    //    }

    this.type = type;

    type   = (Object.keys(this.types).find(e => e == type) ? type : new TypeError('Invalid Presentable type'));

    config = {
        uri:        (typeof config.uri == 'string' ? config.uri : new Error('Invalid uri, expected string')),
        duration:   (typeof config.duration == 'number' ? config.duration : undefined),
        wait:       (typeof config.wait == 'number' ? config.wait : undefined),
        transition: (Object.keys(this.types).find(e => e == config.transition) ? config.transition : undefined)
    };
}

const Display = null;

const Profile = null;

const sql = {
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

Database = class {

    // Constructor
    //    path -> Path to the SQLite database
    constructor(path) {
        this.path = path;
    }

    // connect
    //    path -> Path to the SQLite database
    // Connects to an existing database at the specified location on the system, creates it if necessary
    async connect(path) {
        this.db = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: path
            }
        }); let sanity = await this.sanityCheck();

        return (sanity ? this.db : sanity);
    }

    // sanityCheck()
    //    Performs a sanity check on the database.
    sanityCheck() {
        let sane = true;

        let checkerr = err => {
            if (err) {
                console.error(`[E] sanityCheck failed:\n    > ${err}`);
                sane = false; // Table did not exist and could not set table, unset sane flag
            }
        };

        // Check if tables exist, if not, create them.
        this.db.schema
            .createTable('displays', table => {
                table.increments();
                table.int('profile_id');
                table.string('name');
            })
            .createTable('profiles', table => {
                table.increments();
                table.string('name');
            })
            .createTable('presentables', table => {
                table.increments();
                table.int('profile_id');
                table.text('uri');
                table.int('type');
                table.text('parameters');
            }).asCallback(checkerr);

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

db = new Database("../test2.db");

db.getPresentableByID(0); // Why... is this floating?

export {
    Presentable,
    Display,
    Profile,
    Database
};