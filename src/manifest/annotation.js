import Template from './template.js';

class Annotation extends Template {
    constructor(info) {
        super(info.id, "Annotation");
        this.motivation = "painting";
        this.body = {
            id: null,
            type: "Image",
            format: "image/jpeg",
        };
        this.target = null;
    }

    setTarget(canvas) {
        this.target = canvas;
    }
}

export default Annotation;