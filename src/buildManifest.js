import { Resources } from './manifest/resources.js'
import { DspaceCollection } from './DspaceCollection.js'
import * as path from 'path'
import axios from 'axios'
import sharp from 'sharp'

/**
 * Simple module for generating a IIIF Manifest for a single image
 * served from a IIIF image server
 */

// 1. create DspaceCollection
const baseDir = '/Users/tjjones93/Google Drive/iiif-research-project'
const collectionDir = '/collections/collection_67'

const collection = new DspaceCollection(path.join(baseDir,collectionDir))

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
const IMAGE_SERVER = 'http://localhost:8182'
const ITEM = '20'
const TIFF_DEST = '../../images/'
// 3.2. set params for resources; pass config object to buildManifest
const MANIFEST_CONFIG = {
  // 3.3. add metadata from dublin_core.xml to manifest
  // identify which item for which you want to build a manifest
  // basic metadata for title, author, and date created for item 
  metadata: {
    item: ITEM, // name of item folder
    descriptions: [
      { element: 'title', qualifier: 'none' },
      { element: 'contributor', qualifier: 'author' },
      { element: 'date', qualifier: 'none' }
    ]
  },
  // ids and labels for resources
  manifest: {
    id: `${MANIFEST_SERVER}${collectionDir}/${ITEM}/manifest.json`,
    label: { en: ['this is a test label'] }
  },
  canvas: {
    id: `${MANIFEST_SERVER}${collectionDir}/${ITEM}/canvas`,
    label: 'Canvas with a single IIIF image'
  },
  annotation: {
    id: `${MANIFEST_SERVER}${collectionDir}/${ITEM}/annotation`
  },
  annotationPage: {
    id: `${MANIFEST_SERVER}${collectionDir}/${ITEM}/page`
  }
}

// 5. save manifest file in item folder
export const buildManifest = async (config) => {
  // get info.json for item provided in config
  const image = await collection.parseItemImage(config.metadata.item)
  const res = await axios.get(`${config.imageServer}/iiif/3/${image.parse.name}.tif/info.json`)
  
  // service contains the entire info.json from IIIF image server
  const service = res.data

  const manifestInfo = { id: config.manifest.id, label: config.manifest.label }
  const canvasInfo = { id: config.canvas.id, label: config.canvas.label, height: service.height, width: service.width }
  const annotationInfo = { id: config.annotation.id }
  const AnnotationPageInfo = { id: config.annotationPage.id }

  const manifest = new Resources.Manifest(manifestInfo)
  const canvas = new Resources.Canvas(canvasInfo)
  const annotation = new Resources.Annotation(annotationInfo)
  const annotationPage = new Resources.AnnotationPage(AnnotationPageInfo)

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

  const metadata = await collection.getDescriptiveMetadata(config.metadata)
  manifest.setMetadata(metadata)

  manifest.toFile({
    compact: false,
    file: collection.itemPath(config.metadata.item) + '/manifest.json'
  })

  console.log('-----Manifest created-----')
  console.log('Manifest location:', collection.itemPath(config.metadata.item))
}
/**
 * build pyramid tiff and manifest for item 1 
 */
createTiff(ITEM, TIFF_DEST) 
  .then(info => {
    console.log('image info:', info)
    buildManifest(MANIFEST_CONFIG) 
  })
  .catch(err => console.error(err))
