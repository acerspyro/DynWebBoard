import * as fs from 'fs';

class Config {
    path: string;
    configObject: object;

    constructor(path: string = `config.json`) {
        this.path = `${__root}/${path}`;
        this.configObject = Object();

        this.configObject = this.loadConfig(this.path);
    }

    async initConfig(path: string = this.path) {
        let defaultConfig = {
            databasePath: 'DynWebBoard.sqlite',
            uploadPath: 'uploads'
        };

        return fs.writeFile(path, 'utf8', JSON.stringify(defaultConfig), (e: any) => {
            if (e)  console.error(`[E] Unable to create config file => ${e}`);
            else    console.info(`[I] Created default config file @ '${path}'`);
        });
    }

    async loadConfig(path: string = this.path, callback: Function) { // Callback: (data)
        return fs.readFile(path, 'utf8', async (e: any, data: any) => {
            if (e)  {
                try {
                    fs.accessSync(path, fs.constants.F_OK);
                    console.error(`[E] Unable to read config file => ${e}`);
                } catch {
                    return callback(await this.initConfig());
                }
            } else {
                console.info(`[I] Read config file @ '${path}'`);
                return data;
            }
        });
    }

    get object() {
        return this.configObject;
    }
}

export default Config;