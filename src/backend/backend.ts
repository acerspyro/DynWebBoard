import Presentable  from './presentable';
//import Display      from './display';
//import Profile      from './profile';
import Config       from './config';
import Database     from './database';

function init() {
    let config = new Config();

    config.loadConfig();
}

export default init;
export {
    Presentable,
    //Display,
    //Profile,
    Config,
    Database
};