import Identifier from './identifier.js';

class Annotation extends Identifier {
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