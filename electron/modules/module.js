class Module {
    constructor(ctx) {
        this._ctx = ctx;
    }

    init() {
        throw new Error('Unimplenent');
    }
}

module.exports = Module;