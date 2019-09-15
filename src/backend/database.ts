import * as knex from "knex";
import * as fs from 'fs';

class Database {
    path: string; // SQLite DB Path
    dbObject: knex;

    constructor(path: string) {
        this.path = path;
        this.dbObject = knex("");
    }

    destroy() {
        this.dbObject.destroy();
    }

    connect(path: string) {

        this.dbObject = knex({
            client: 'sqlite3',
            connection: {
                filename: path
            },
            useNullAsDefault: true
        });
        
        return this.checkSanity(this.dbObject);
    }

    checkSanity(dbObject: knex = this.dbObject) { /* Sanity check on a given database */

        let dbObjectFilename = dbObject.client.connectionSettings.filename;

        function initDatabase(dbObject: knex) { /* Initialize a fresh database */
            return dbObject.schema
                .createTable('displays', (table: any) => {
                    table.increments();
                    table.integer('profile_id');
                    table.string('name');
                })
                .createTable('profiles', (table: any) => {
                    table.increments();
                    table.string('name');
                })
                .createTable('presentables', (table: any) => {
                    table.increments();
                    table.integer('profile_id');
                    table.text('uri');
                    table.integer('type');
                    table.text('parameters');
                })
                .asCallback((e: Error) => {
                    if (e)  console.error(`[E] Unable to create database => ${e}`);
                    else    console.log(`[I] New database created => ${dbObjectFilename}`);
                });
        }

        function verifyDatabase(dbObject: knex, deepVerify: boolean = false) { /* Verify database for corruption. */
            /* If deepVerify is false, simply check that table structures are correct.
             * If deepVerify is true, iterate through each table entry to verify the data format.*/

            /* TO DO */

            console.info("[I] Stub: verifyDatabase()");
            return dbObject;
        }

        function repairDatabase(dbObject: knex, deepRepair: boolean = false, backupDatabase: boolean = true) { /* Automatically repair database */
            /* If deepRepair is false, simply restore missing tables or headers and set everything to default.
             * If deepRepair is true, iterate through data and either attempt to rescue corrupt data or restore to default. */

            /* TO DO */

            console.info("[I] Stub: repairDatabase()");
            return dbObject;
        }

        fs.access(dbObjectFilename, fs.constants.F_OK, (e: any) => {
            if (e) {
                console.warn(`[W] File with path ${dbObjectFilename} does not exist. Creating fresh database.`);
                initDatabase(this.dbObject);
            } else {
                console.info(`[I] File with path ${dbObjectFilename} exists, verifying integrity.`);
                verifyDatabase(this.dbObject);
            }
        });

        return dbObject;
    }

    getDisplayByID(id: number) {
        return this.dbObject<Database.Display>('displays')
            .where('id', id);
    }

    getProfileByID(id: number) {
        return this.dbObject<Database.Profile>('profiles')
            .where('id', id);
    }

    getPresentableByID(id: number) {
        return this.dbObject<Database.Presentable>('presentables')
            .where('id', id);
    }

    getPresentablesByProfileID(id: number) {
        return this.dbObject<Database.Presentable>('presentables')
            .where('profile_id', id);
    }
}

namespace Database {
    export interface Display {
        id: number,
        profile_id: number,
        name: string
    }

    export interface Profile {
        id: number,
        name: string
    }

    export interface Presentable {
        id: number,
        profile_id: number,
        uri: string,
        type: number,
        parameters: string
    }
}

export default Database;