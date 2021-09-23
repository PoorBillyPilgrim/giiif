import Identifier from './identifier.js';

class Canvas extends Identifier {
    constructor(info) {
        super(info.id, "Canvas");
        this.label = { "en": [ info.label ] };
        this.height = info.height;
        this.width = info.width;
    }
}

export default Canvas;