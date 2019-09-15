import * as fs from 'fs';

class Config {
    path: string;
    configObject: object;

    constructor(path: string = `config.json`) {
        this.path = `${__root}/${path}`;
        this.configObject = Object();

        this.configObject = this.loadConfig();
    }

    initConfig(path: string = this.path) {
        let defaultConfig = {
            databasePath: 'DynWebBoard.sqlite',
            uploadPath: 'uploads'
        };

        return fs.writeFile(path, JSON.stringify(defaultConfig), (e: any) => {
            if (e)  console.error(`[E] Unable to create config file => ${e}`);
            else    console.info(`[I] Created default config file @ '${path}'`);
        });
    }

    async loadConfig(path: string = this.path) {
        fs.readFile(path, (e: any) => {
            if (e)  {
                try {
                    fs.accessSync(path, fs.constants.F_OK);
                    console.error(`[E] Unable to read config file => ${e}`);
                } catch {
                    return this.initConfig();
                }
            } else {
                console.info(`[I] Read config file @ '${path}'`);
            }
        });
    }

    get object() {
        return this.configObject;
    }
}

export default Config;