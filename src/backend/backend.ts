import Presentable  from './presentable';
//import Display      from './display';
//import Profile      from './profile';
import Config       from './config';
import Database     from './database';

async function Backend() {

    let config = new Config();
    await config.loadConfig();

    let database = new Database();
    database.connect();
}

export default Backend;
export {
    Presentable,
    //Display,
    //Profile,
    Config,
    Database
};