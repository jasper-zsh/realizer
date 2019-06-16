const events = require('events');

const configMap = {
    0: 'stepPulse',
    1: 'stepIdleDelay',
    2: 'stepPortInvert',
    3: 'dirPortInvert',
    4: 'stepEnableInvert',
    5: 'limitPinsInvert',
    6: 'probePinInvert',
    10: 'statusReport',
    11: 'junctionDeviation',
    12: 'arcTolerance',
    13: 'reportInches',
    20: 'softLimits',
    21: 'hardLimits',
    22: 'homingCycle',
    23: 'homingDirInvert',
    24: 'homingFeed',
    25: 'homingSeek',
    26: 'homingDebounce',
    27: 'homingPullOff',
    100: 'xStepLength',
    101: 'yStepLength',
    102: 'zStepLength',
    110: 'xMaxRate',
    111: 'yMaxRate',
    112: 'zMaxRate',
    120: 'xAccel',
    121: 'yAccel',
    122: 'zAccel',
    130: 'xMaxTravel',
    131: 'yMaxTravel',
    132: 'zMaxTravel',
};

class Grbl09Machine extends events.EventEmitter {
    constructor(props) {
        super();
        this._connector = props.connector;
        this._connector.on('status', (status) => {
            (async () => {
                if (status === 'connected') {
                    await this.init();
                }
                this.emit('status', this.getStatus());
            })();
        });
        switch (props.unit) {
            case 'mm':
                this._unitCmd = 'G21';
                break;
            case 'inch':
                this._unitCmd = 'G20';
                break;
            default:
                console.log('Unknown unit, fallback to mm.');
                this._unitCmd = 'G21';
                break;
        }
        this._inited = false;
    }

    async init() {
        const greet = await this._connector.readLine();
        if (greet === 'Grbl 0.9j [\'$\' for help]') {
            this._inited = true;
            await this.readConfig();
        } else {
            this._inited = false;
        }
        await this.updateStatus();
        this.emit('status', this.getStatus());
    }

    getStatus () {
        const connStatus = this._connector.getStatus();
        switch (connStatus) {
            case 'disconnected':
                return 'offline';
            case 'connected':
                switch (this._status) {
                    case 'ready':
                        return 'ready';
                    default:
                        return 'unknown';
                }
            default:
                return 'unknown';
        }
    }

    async updateStatus() {
        if (!this._inited) {
            this._status = 'offline';
        }
        const res = await this._connector.send('?\n');
        const statusParts = new RegExp('<(.*)>').exec(res)[1].split(',');
        switch (statusParts[0]) {
            case 'Idle':
                this._status = 'ready';
                break;
            default:
                this._status = 'unknown';
                break;
        }
    }

    async readConfig() {
        const configData = await this._connector.send('$$\n');
        const config = {};
        for (const configLine of configData.split('\n')) {
            if (configLine.startsWith('$')) {
                const configStr = configLine.split(' ')[0];
                const configPair = configStr.substring(1).split('=');
                config[configMap[configPair[0]]] = configPair[1];
            }
        }
        console.log(config);
    }

    async move(x, y, z, relavant=true) {
        let moveCmd;
        if (relavant) {
            moveCmd = 'G91';
        } else {
            moveCmd = 'G90';
        }
        await this._connector.send(`${moveCmd} ${this._unitCmd} X${x} Y${y} Z${z}\n`);
    }
}

module.exports = Grbl09Machine;