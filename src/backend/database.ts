import knex from "knex";
import fs from 'fs';

class Database {
    path: string; // SQLite DB Path
    dbObject: knex;

    constructor(path: string) {
        this.path = path;
    }

    connect(path: string) {
        this.dbObject = knex({
            client: 'sqlite3',
            connection: {
                filename: path
            }
        });
        
        let sanity = this.checkSanity(this.dbObject);

        return (sanity ? this.dbObject : sanity);
    }

    checkSanity(dbObject: knex = this.dbObject) { /* Sanity check on a given database */
        let sane = true;

        let checkerr = (e: Error) => {
            if (e) {
                console.error(`[E] sanityCheck failed:\n    > ${e}`); // Replace with dedicated logging function
                sane = false; // Table did not exist and could not set table, unset sane flag
            }
        };

        // Check if tables exist, if not, create them.
        this.dbObject.schema
            .createTable('displays', table => {
                table.increments();
                table.integer('profile_id');
                table.string('name');
            })
            .createTable('profiles', table => {
                table.increments();
                table.string('name');
            })
            .createTable('presentables', table => {
                table.increments();
                table.integer('profile_id');
                table.text('uri');
                table.integer('type');
                table.text('parameters');
            }).asCallback(checkerr);

        // TODO: Check if table columns are valid, if not, adjust them

        return sane;
    }

    // Getter generator
    getByID(id, queryName, method = 'each') {
        if (!this.dbObject) this.connect(this.path);
        let ret = Object();

        this.dbObject[method](dynWebBoard.sql[queryName], id, (err, row) => {
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

export default Database;