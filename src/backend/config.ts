import * as fs from 'fs';
import * as xdgBasedir from 'xdg-basedir';

interface ConfigObject {
    a: string;
    [propName: string]: any;
}

interface T_Config {
    filename?: string;
    currentConfig?: ConfigObject;

    readonly defaultFilename: string;
    readonly defaultConfig: ConfigObject;

    load(filename?: string): ConfigObject;
    create(filename?: string): ConfigObject;
}

const Config: T_Config = {
    defaultConfig: {
        a: 'aaa'
    },
    defaultFilename: `${xdgBasedir.config}/dwb/config.json`,

    load(filename?: string) {
        this.filename = filename || this.defaultFilename;

        try {

            fs.accessSync(this.filename, fs.constants.F_OK); // Test if file exists

            const data = fs.readFileSync(this.filename, 'utf8'); // TODO: Check if file is valid!
            console.info(`[I] Read config file @ '${this.filename}'`);

            this.currentConfig = JSON.parse(data);

        } catch(err) {

            console.error(`[E] Unable to read config file @ '${this.filename}' => ${err}`);
            
        } finally {
            return this.currentConfig || this.create();
        }
        
    },

    create(filename?: string) {
        this.filename = filename || this.defaultFilename;

        try {

            const parentDirectory   = this.filename.substr(0, this.filename.lastIndexOf('/'));
            const defaultConfigJSON = JSON.stringify(this.defaultConfig, null, 4)

            fs.mkdirSync(parentDirectory, {recursive: true}); // Ensure directory leading up to the file exists
            fs.writeFileSync(this.filename, defaultConfigJSON, 'utf8');

            console.info(`[I] Created default config file @ '${this.filename}'`);

        } catch(err) {

            console.error(`[E] Unable to create config file => ${err}`);
            console.warn(`[W] WARNING: Running off of default configuration!`);

        } finally {
            this.currentConfig = this.defaultConfig;
            return this.currentConfig;
        }
    }
}

export {
    Config,
    ConfigObject
}