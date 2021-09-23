import Identifier from './identifier.js'

class Presentation extends Identifier {
    constructor() {
        this["@context"] = "http://iiif.io/api/presentation/3/context.json"
    }
}

export default Presentation;