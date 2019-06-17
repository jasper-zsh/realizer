const Module = require('./module');
const { ipcMain } = require('electron');
const Sharp = require('sharp');
const fs = require('fs');

class LaserModule extends Module {
    constructor(props) {
        super(props);
    }

    init() {
        ipcMain.on('laser/image.update', (event, filePath, width, height, pointSize) => {
            this._pointSize = pointSize;
            (async () => {
                const img = Sharp(filePath)
                    .resize({
                        width: width / pointSize,
                        height: height / pointSize,
                        fit: 'inside',
                    })
                    .grayscale();
                const { data, info } = await img
                    .raw()
                    .toBuffer({ resolveWithObject: true });
                this._data = data;
                this._info = info;
                const jpg = await img.jpeg()
                    .toBuffer();
                event.reply('laser/image', `data:image/jpeg;base64,${jpg.data.toString('base64')}`)
            })();
        });
        ipcMain.on('laser/print', (event, power, timing) => {
            const stream = fs.createWriteStream('gcode.txt');
            for (const command of this.compile(power, timing)) {
                stream.write(command + '\n');
            }
            stream.close();
        })
    }

    *compile(power, timing) {
        yield this._ctx.machine.powerCmd(0);
        yield this._ctx.machine.startCmd();
        for (let i = this._data.length - 1; i >= 0; i --) {
            const level = this._data[i];
            const targetPower = Math.floor(power * level / 255)
            if (targetPower === 0) {
                continue;
            }
            const x = i % this._info.width * this._pointSize;
            const y = Math.floor(i / this._info.width) * this._pointSize;
            yield this._ctx.machine.moveCmd(x, y, 0, false);
            yield this._ctx.machine.powerCmd(targetPower);
            yield this._ctx.machine.pauseCmd(timing);
            yield this._ctx.machine.powerCmd(0);
        }
        yield this._ctx.machine.stopCmd();
    }
}

module.exports = LaserModule;