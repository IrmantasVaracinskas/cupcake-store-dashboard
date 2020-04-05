"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
let win;
electron_1.app.on('ready', createWindow);
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, `/../../dist/angular-electron/index.html`),
        protocol: 'file:',
        slashes: true,
    }));
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
    electron_1.ipcMain.on('readFile', (event, arg) => {
        const out = fs.readFileSync(arg);
        win.webContents.send('readFileResponse', out.toString());
    });
}
//# sourceMappingURL=main.js.map