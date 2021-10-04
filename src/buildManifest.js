import { ManifestFactory } from './manifest/factory.js'
import { DspaceCollection } from './DspaceCollection.js'
import * as path from 'path'
import axios from 'axios'
import sharp from 'sharp'

/**
 * Simple module for generating a IIIF Manifest for a single image
 * served from a IIIF image server
 */

// 1. create DspaceCollection
const collection = new DspaceCollection('../../collections/collection_67')

// 2. create pyramid TIFF
const createTiff = async (item, dest) => {
  // 2.1. get image path and file name for item
  const { parse, imagePath } = await collection.parseItemImage(item)
  // 2.2. convert image to Pyramid TIFF and name as file name without original ext
  return sharp(imagePath)
    .tiff({ tile: true, pyramid: true })
    .toFile(path.resolve(dest, `${parse.name}.tif`))
}

// 3. Define metadata and identifiers for resources
// 3.1. set server location
const MANIFEST_SERVER = 'http://localhost:8887' // location for Web Server for Chrome
// 3.2. set params for resources; pass config object to buildManifest
const MANIFEST_CONFIG = {
  // 3.3. add metadata from dublin_core.xml to manifest
  // identify which item for which you want to build a manifest
  // basic metadata for title, author, and date created for item 
  metadata: {
    item: '1', // name of item folder
    descriptions: [
      { element: 'title', qualifier: 'none' },
      { element: 'contributor', qualifier: 'author' },
      { element: 'date', qualifier: 'none' }
    ]
  },
  // ids and labels for resources
  manifest: {
    id: `${MANIFEST_SERVER}/manifest.json`,
    label: { en: ['this is a test label'] }
  },
  canvas: {
    id: `${MANIFEST_SERVER}/canvas`,
    label: 'Canvas with a single IIIF image'
  },
  annotation: {
    id: `${MANIFEST_SERVER}/annotation`
  },
  annotationPage: {
    id: `${MANIFEST_SERVER}/page`
  }
}

// 5. save manifest file in item folder
const buildManifest = async (options) => {
  const res = await axios.get('http://localhost:8182/iiif/3/image.tif/info.json')
  // service contains the entire info.json from IIIF image server
  const service = res.data

  const manifestInfo = { id: options.manifest.id, label: options.manifest.label }
  const canvasInfo = { id: options.canvas.id, label: options.canvas.label, height: service.height, width: service.width }
  const annotationInfo = { id: options.annotation.id }
  const AnnotationPageInfo = { id: options.annotationPage.id }

  const manifest = new ManifestFactory.Manifest(manifestInfo)
  const canvas = new ManifestFactory.Canvas(canvasInfo)
  const annotation = new ManifestFactory.Annotation(annotationInfo)
  const annotationPage = new ManifestFactory.AnnotationPage(AnnotationPageInfo)

  // derive info needed to set annotation body from info.json for type Image
  annotation.setBody({
    id: service.id + '/full/max/0/default.jpg', // entire Image API URL
    type: 'Image',
    format: 'image/jpeg',
    height: service.height, // from info.json
    width: service.width, // from info.json
    service: service // from info.json
  })
  annotation.setTarget(canvas.id)
  annotationPage.addItems(annotation)
  canvas.addItems(annotationPage)
  manifest.addItems(canvas)

  const metadata = await collection.getDescriptiveMetadata(options.metadata)
  manifest.setMetadata(metadata)

  manifest.toFile({
    compact: false,
    file: './manifest.json'
  })
  console.log('-----Manifest created-----')
}
/**
 * build pyramid tiff and manifest for item 1 
 */
createTiff('1', '../../images/') 
  .then(info => {
    console.log('image info:', info)
    buildManifest(MANIFEST_CONFIG) 
  })
  .catch(err => console.error(err))
