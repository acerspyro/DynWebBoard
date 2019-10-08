import * as Presentable from './presentable';
import * as Display from './display';
//import Profile      from './profile';
import {Config, ConfigObject} from './config';
import * as Database from './database';

class Backend {



    constructor() {}

    async init() {
        await config.loadConfig();

        let database = new Database.Database();
        await database.connect();

        async function loadDisplays() {

            //this.database.get();

        }

        database.getDisplayByID(1)
            .then((b: any) => {
                console.log(b)
            });
    }

}

export {
    Backend,
    Presentable,
    Display,
    Config,
    Database
};