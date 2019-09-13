const {app,BrowserWindow} = require('electron');
const ipc                 = require('electron').ipcMain;
const fs                  = require('fs');
const path                = require('path');

const Presentable   = require('./presentable');
const Display       = require('./display');
const Profile       = require('./profile');
const Database      = require('./database');

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