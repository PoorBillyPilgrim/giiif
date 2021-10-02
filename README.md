# giiif (georgia tech iiif)
giiif is a Node.js project for generating IIIF v3 Manifests using information gathered from `info.json` files generated by a Cantaloupe image server and `dublin_core.xml` files from DSpace

## Example
```js
import DSpaceCollection from 'giiif/src/DSpaceCollection.js'
const collection = new DSpaceCollection(path)

import { ManifestFactory } from 'giiif/src/manifest/index.js'

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
    file: 'manifest.json'
})
```

## Features
### DSpaceCollection Class
The package offers a DSpaceCollection class that represents a single exported DSpace collection
```
collection
    - item
        - contents
            - dublin_core.xml
            - image.jpg
```
