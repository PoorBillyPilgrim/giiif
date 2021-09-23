import Template from './template.js';

class Canvas extends Template {
    constructor(info) {
        super(info.id, "Canvas");
        this.label = { "en": [ info.label ] };
        this.height = info.height;
        this.width = info.width;
    }
}

export default Canvas;