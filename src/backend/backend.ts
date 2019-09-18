import Presentable  from './presentable';
import Display      from './display';
//import Profile      from './profile';
import Config       from './config';
import Database     from './database';

async function Backend() {

    let config = new Config();
    await config.loadConfig();

    let database = new Database();
    await database.connect();

    async function loadDisplays() {

        //this.database.get();

    }

    database.getDisplayByID(1)
        .then((b: any) => {
            console.log(b)
        });

}

export default Backend;
export {
    Presentable,
    //Display,
    //Profile,
    Config,
    Database
};