import * as electron from 'electron';

/* https://electronjs.org/docs/api/structures/display
 *  
 * Display information is fetched directly from Electron using screen.getAllDisplays()
 *  -> https://electronjs.org/docs/api/screen#screengetalldisplays
 */

class Display {
    name: string; // Visible, user-chosen name for the display
    scaleFactor: number;  // 0 = auto
    displayID: number; // Actual Electron display ID, see https://github.com/electron/electron/issues/6899

    constructor(name: string = "Unnamed Display", scaleFactor: number = 1, displayID: number = -1) {

        this.name = name;
        this.scaleFactor = scaleFactor;
        this.displayID = displayID;

    }

    destroy() {



    }
}

export default Display;