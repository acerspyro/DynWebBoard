/* https://electronjs.org/docs/api/structures/display
 *  
 * Display information is fetched directly from Electron using screen.getAllDisplays()
 *  -> https://electronjs.org/docs/api/screen#screengetalldisplays
 */

interface Config {
    electronDisplayID: number, // https://github.com/electron/electron/issues/6899
    scaleFactor: number  // 0 = auto
};

class Display {

}

export default Display;
export {
    Config
}