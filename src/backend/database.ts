import * as knex from "knex";
import * as fs from 'fs';
import * as xdgBasedir from 'xdg-basedir';

class Database {
    path: string; // SQLite DB Path
    dbObject: knex;

    constructor(path: string = `${xdgBasedir.config}/dwb/dynwebboard.sqlite`) {
        this.path = path;
        this.dbObject = knex("");
    }

    destroy() {
        this.dbObject.destroy();
    }

    async connect(path: string = this.path) {

        try {

            this.dbObject = knex({
                client: 'sqlite3',
                connection: {
                    filename: path
                },
                useNullAsDefault: true
            });
            
            await this.checkSanity(this.dbObject);
            console.info(`[I] Database loaded @ '${path}'`);
            
            return true;

        } catch(e) {

            console.error(`[E] Database could not be loaded @ '${path}' => ${e}`);
            console.warn(`[W] WARNING: Running off of a volatile database!`);
            console.warn(`[W] WARNING: DynWebBoard is in DEMO MODE, your changes will NOT be saved! You have been WARNED!`);
            console.info("[I] Stub: connect():noDatabaseLoaded");
            return false;

        }

    }

    async checkSanity(dbObject: knex = this.dbObject) { /* Sanity check on a given database */

        let path = dbObject.client.connectionSettings.filename;

        async function initDatabase() { /* Initialize a fresh database */

            // TODO: Backup database to avoid data loss

            return await dbObject.schema
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
                    if (e)  console.error(`[E] Unable to create database @ '${path}' => ${e}`);
                    else    console.log(`[I] Created new database @ '${path}'`);
                });

        }

        function verifyDatabase(deepVerify: boolean = false) { /* Verify database for corruption. */
            /* If deepVerify is false, simply check that table structures are correct.
             * If deepVerify is true, iterate through each table entry to verify the data format.*/

            /* TO DO */

            console.info(`[I] Verifying database integrity...`);
            console.info("[I] Stub: verifyDatabase()");
            
            return true;
        }

        function repairDatabase(deepRepair: boolean = false, backupDatabase: boolean = true) { /* Automatically repair database */
            /* If deepRepair is false, simply restore missing tables or headers and set everything to default.
             * If deepRepair is true, iterate through data and either attempt to rescue corrupt data or restore to default. */

            /* TO DO */

            console.info(`[I] Repairing database...`);
            console.info("[I] Stub: repairDatabase()");
            return true;
        }


        try {

            fs.accessSync(path, fs.constants.F_OK);
            console.info(`[I] Loaded database @ '${path}'`);

            if (!verifyDatabase()) {
                if (!repairDatabase()) {
                    await initDatabase();
                }
            }

        } catch(e) {

            console.error(`[E] Unable to load database @ '${path}' => ${e}`);
            
            await initDatabase();

        }

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