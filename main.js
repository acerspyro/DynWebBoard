#!/bin/node

const {app,BrowserWindow} = require('electron');
const ipc                 = require('electron').ipcMain;
const path                = require('path');


//const BrowserWindow = remote.BrowserWindow;

global.contentConfig = null;
global.currentViewID = 0;
//global.openWebPages = new Array();


app.on('ready', () => {

    // Create main window
    global.appWindow = new BrowserWindow({
        frame: false,
        kiosk: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Handle window closing
    global.appWindow.on('close', () => {
        global.appWindow = null; // Clear memory for window
        // Will NodeJS automatically return?
    });

    // Load our main content (./index.html)
    global.appWindow.loadURL(path.join('file://', __dirname, 'index.html'));

    // Initialize the window
    global.appWindow.show();

    loadContentConfig = () => {
        oldPackage = global.contentConfig;

        try {
            if (oldPackage != null && oldPackage != global.contentConfig) {
                // Do something... For now, manually restart the program.
            }
            global.contentConfig = require('./sites.json');
        } catch {
            if (global.contentConfig == null) {
                console.log('ERR: Cannot start due to invalid configuration. Please check your package.json!');
                process.exit();
            } else {
                console.log('WARN: Current configuration invalid, keeping known good configuration.');
                global.contentConfig = oldPackage;
            }
        }
    }

    loadContents = (confID) => {
        global.appWindow.webContents.send('loadContent', {
            "id": confID,
            "conf": global.contentConfig
        });
    }

    ipc.on('appReady', () => {
        t = () => {
            loadContentConfig();
            loadContents(global.currentViewID);
            global.currentViewID = (global.currentViewID < global.contentConfig.length-1 ? global.currentViewID+1 : 0);
        };
        // Load first website in app
        t(currentViewID);

        setInterval(t, global.contentConfig[global.currentViewID].duration*1000);
    });

});


/*
class WebPage {
    constructor(prop) {
        this.prop = prop;

        this.win = new BrowserWindow(
            {"kiosk": true, "frame": false}
        );

        global.openWebPages.push(this);
    }

    loadWebPage() {
        this.win.loadURL(this.prop.url);

        function ready_to_show(that) {
            that.win.show();

            if (global.openWebPages.length > 1) {
                try {
                    global.openWebPages[
                        global.openWebPages.indexOf(that)-1
                    ].hideWebPage();
                } catch {
                    global.openWebPages[
                        global.openWebPages.length-1
                    ].hideWebPage();
                }

                function f_hideTimer(that) {
                    try {
                        global.openWebPages[
                            global.openWebPages.indexOf(that)+1
                        ].loadWebPage();
                    } catch {
                        global.openWebPages[0].loadWebPage();
                    }
                }

                that.hideTimer = setTimeout(
                    f_hideTimer.bind(null, that),
                    that.prop.duration*1000
                );
            }
        }

        this.win.webContents.once('dom-ready', ready_to_show.bind(null, this));
    }

    hideWebPage() {
        this.win.hide();
    }

    destroy() {
        this.win = null;

        global.openWebPages.splice(
            global.openWebPages.indexOf(this), 1
        );
    }
}

function main() {
    app.on('ready', () => {
        loadConf();
    });
}

function loadConf() {
    oldPackage = global.sitesConfig;

    try {
        global.sitesConfig = require('./package.json').sites;

        if (oldPackage != global.sitesConfig) {
            global.sitesConfig.forEach(site => {
                new WebPage(site);
            });
            global.openWebPages.forEach(page => {
                page.loadWebPage();
            });
        }
    } catch {
        if (global.sitesConfig == null) {
            console.log('ERR: Cannot start due to invalid configuration. Please check your package.json!');
            process.exit();
        } else {
            console.log('WARN: Current configuration invalid, keeping known good configuration.');
        }
    }
}

main();

*/
