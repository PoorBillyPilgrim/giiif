import fs from 'fs';
import Manifest from './manifest.js';
import Canvas from './canvas.js';
import Annotation from './annotation.js';
import AnnotationPage from './annotation-page.js';

const iiif_img = 'http://localhost:8182/iiif/3/collection_67_1.tif';
const id = "localhost:8080/collections/collection_67/1";

const manifest = new Manifest({
    "id": "http://localhost:8080/iiif/test/manifest.json",
    "label": { "en": [ "this is a label "] }
});
let canvasInfo = { id: id + "/canvas", label: "Canvas with a single IIIF image", height: 500, width: 400 };
let canvas = new Canvas(canvasInfo);
let annotation = new Annotation( {id: id + "/annotation"} );
let annotationPage = new AnnotationPage({id: id + "/page"});
annotation.setTarget(canvas.id);
annotationPage.addItems(annotation);
canvas.addItems(annotationPage);
manifest.addItems(canvas)

fs.writeFile('manifest.json', JSON.stringify(manifest, null, 2), () => console.log('file written'));
