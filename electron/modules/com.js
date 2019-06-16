const Module = require('./module');
const { ipcMain } = require('electron');
const SerialPort = require('serialport');

class ComModule extends Module {
    constructor(ctx) {
        super(ctx);
    }

    init() {
        ipcMain.on('com/list.update', (event) => {
            console.log('Updaing com list...');
            SerialPort.list((err, ports) => {
                console.log('Com list updated.', err, ports);
                event.reply('com/list', err, ports);
            });
        });
    }
}

module.exports = ComModule;