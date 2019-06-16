const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const events = require('events');

let window;

const ctx = new events.EventEmitter();
ctx.app = app;

const module_cls = [
    require('./modules/grbl'),
    require('./modules/com'),
];

let createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '..', 'public', 'electron.js')
        }
    });
    ctx.window = window;

    window.loadURL('http://localhost:3000');
    // window.loadFile('../build/');

    window.on('closed', () => {
        window = null;
        ctx.window = null;
    });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (window == null) {
        createWindow();
    }
});
for (let cls of module_cls) {
    const module = new cls(ctx);
    module.init();
}