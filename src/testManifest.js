import { ManifestFactory } from './manifest/index.js'

//const iiifImg = 'http://localhost:8182/iiif/3/collection_67_1.tif'
const id = 'localhost:8080/collections/collection_67/1'

const manifestInfo = { id: 'http://localhost:8080/iiif/test/manifest.json', label: { en: ['this is a label '] } }
const canvasInfo = { id: id + '/canvas', label: 'Canvas with a single IIIF image', height: 500, width: 400 }
const annotationInfo = { id: id + '/annotation' }
const AnnotationPageInfo = { id: id + '/page' }

const manifest = new ManifestFactory.Manifest(manifestInfo)
const canvas = new ManifestFactory.Canvas(canvasInfo)
const annotation = new ManifestFactory.Annotation(annotationInfo)
const annotationPage = new ManifestFactory.AnnotationPage(AnnotationPageInfo)

annotation.setTarget(canvas.id)
annotationPage.addItems(annotation)
canvas.addItems(annotationPage)
manifest.addItems(canvas)

manifest.toFile({
  compact: false,
  file: './manifestTest.json'
})

// fs.writeFile('./manifest.json', JSON.stringify(manifest, null, 2), () => console.log('file written'));
