import { Manifest } from './manifest.js';

const manifest = new Manifest({
    "id": "http://localhost:8080/iiif/test/manifest.json",
    "label": { "en": [ "this is a label "] }
});
manifest.setMetadata({
    "label": "title",
    "value": "this is a title"
});
manifest.toFile( {compact: true} ); // set to false for human readability, true to reduce file size