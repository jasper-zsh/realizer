const Module = require('./module');
const { ipcMain } = require('electron');
const ComConnector = require('../components/com_connector');
const Grbl09Machine = require('../components/grbl09');

class GrblModule extends Module {
    constructor(ctx) {
        super(ctx);
        this._connector = new ComConnector();
        this._machine = new Grbl09Machine({
            connector: this._connector
        });
        ctx.machine = this._machine;
    }

    init() {
        this._machine.on('status', (status) => {
            if (this._ctx.window) {
                this._ctx.window.webContents.send('machine/status', status);
            }
        });
        ipcMain.on('machine/status.update', (event) => {
            event.reply('machine/status', this._machine.getStatus());
        });
        ipcMain.on('connector/select_port', (event, port) => {
            (async () => {
                try {
                    await this._connector.setPort(port);
                } catch (e) {
                    console.error(e);
                    event.reply('connector/connect.error', e);
                }
            })();
        });
        this._connector.on('data', (data) => {
            if (this._ctx.window) {
                this._ctx.window.webContents.send('connector/data', data);
            }
        });
        ipcMain.on('connector/send', (event, data) => {
            if (this._connector.getStatus() === 'connected') {
                (async () => {
                    const response = await this._connector.send(data + '\n');
                    event.reply('connector/send.response', response);
                })();
            }
        });
        ipcMain.on('machine/move', (event, x, y, z, relavant) => {
            if (this._machine.getStatus() === 'ready') {
                (async() => {
                    await this._machine.move(x, y, z, relavant);
                })();
            }
        });
    }
}

module.exports = GrblModule;