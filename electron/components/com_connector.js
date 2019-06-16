const Connector = require('./connector');
const SerialPort = require('serialport');

class ComConnector extends Connector {
    constructor() {
        super();
        this._status = 'disconnected';
        this._serialPort = null;
    }

    getStatus() {
        return this._status;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this._serialPort = new SerialPort(this._port, {
                baudRate: 115200
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this._status = 'connected';
                    this._parser = this._serialPort.pipe(new SerialPort.parsers.Readline({ delimiter: '\r\n' }));
                    this._parser.on('data', (line) => {
                        if (line.length > 0) {
                            this.emit('data', line);
                        }
                    });
                    this.emit('status', 'connected');
                    resolve();
                }
            });
        });

    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            if (this._serialPort !== null) {
                this._serialPort.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this._status = 'disconnected';
                        this.emit('status', 'disconnected');
                        this._serialPort = null;
                        this._parser = null;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        })
    }

    async send(data) {
        return new Promise((resolve, reject) => {
            this._serialPort.write(data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    let buf = '';
                    const listener = (line) => {
                        buf += `${line}\n`;
                        if (!line.endsWith('ok')) {
                            this.once('data', listener);
                        } else {
                            resolve(buf);
                        }
                    };
                    this.once('data', listener);
                }
            });
        })
    }

    async setPort(port) {
        await this.disconnect();
        this._port = port;
        await this.connect();
    }

    async readLine() {
        return new Promise((resolve) => {
            const listener = (data) => {
                if (data.length !== 0) {
                    resolve(data);
                } else {
                    this.once('data', listener);
                }
            };
            this.once('data', listener);
        });
    }
}

module.exports = ComConnector;