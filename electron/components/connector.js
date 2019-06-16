const events = require('events');

class Connector extends events.EventEmitter {
    constructor() {
        super();
    }

    getStatus() {
        throw new Error('Unimplement');
    }

    async connect() {
        throw new Error('Unimplement');
    }

    async disconnect() {
        throw new Error('Unimplement');
    }

    async send(data) {
        throw new Error('Unimplement');
    }

    async readLine() {
        throw new Error('Unimplement');
    }
}

module.exports = Connector;