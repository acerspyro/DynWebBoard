import * as fs from 'fs';
import * as xdgBasedir from 'xdg-basedir';

class Config {
    path: string;
    configObject: object;

    constructor(path: string = `${xdgBasedir.config}/dwb/config.json`) {

        this.path = path;
        this.configObject = Object();

    }

    async initConfig(path: string = this.path) {

        let defaults = {
            databasePath: `${xdgBasedir.config}/dwb/DynWebBoard.sqlite`,
            uploadPath: `${xdgBasedir.config}/dwb/uploads/` // Place in xdgBasedir.data instead?
        };

        try {

            fs.mkdirSync(path.substr(0, path.lastIndexOf('/')), {recursive: true});
            fs.writeFileSync(path, JSON.stringify(defaults, null, 4), 'utf8');
            console.info(`[I] Created default config file @ '${path}'`);

        } catch(e) {

            console.error(`[E] Unable to create config file => ${e}`);
            console.warn(`[W] WARNING: Running off of default configuration!`);

        } finally {

            return JSON.stringify(defaults, null, 4);

        }

    }

    async loadConfig(path: string = this.path) {

        try {

            fs.accessSync(path, fs.constants.F_OK); // Test if file exists

            let data = fs.readFileSync(path, 'utf8'); // TODO: Check if file is valid!
            console.info(`[I] Read config file @ '${path}'`);

            return data;

        } catch(e) {

            console.error(`[E] Unable to read config file => ${e}`);
            return await this.initConfig(path);
            
        }

    }

    get object() {
        return this.configObject;
    }
}

export default Config;