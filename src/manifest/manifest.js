import fs from 'fs';
import Presentation from './presentation.js';

 export class Manifest extends Presentation {
    constructor(options) {
        super(); // inherit this.props from Presentation
        this.props.id = options.id;
        this.props.type = "Manifest";
        this.props.label = options.label;
    }

    toFile(options) {
        let spaces = options.compact ? 0 : 2;
        fs.writeFileSync('./test.json', JSON.stringify(this.props, null, spaces));
    }

    setMetadata(src) {
        this.props.metadata = [ src ];
    }

    print() {
        console.log(this.props);
    }
}

/*
const manifest = new Manifest({
    "id": "http://localhost:8080/iiif/test/manifest.json",
    "label": { "en": [ "this is a label "] }
});
manifest.setMetadata({
    "label": "title",
    "value": "this is a title"
});
manifest.toFile( {compact: true} ); // set to false for human readability, true to reduce file size
*/