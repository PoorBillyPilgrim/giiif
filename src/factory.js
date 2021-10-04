//import { Resources } from './manifest/resources.js'
import { DspaceCollection } from './DspaceCollection.js'
import { buildManifest } from './buildManifest.js'
import { createTiff } from './createTiff.js'
import * as path from 'path'



/**
 * @module ManifestFactory
 * Simple module for generating a IIIF Manifest for a single image
 * served from a IIIF image server
 */

// 1. create DspaceCollection
const baseDir = '/Users/tjjones93/Google Drive/iiif-research-project'
const collectionDir = '/collections/collection_67'

const collection = new DspaceCollection(path.join(baseDir,collectionDir))


// 3. Define metadata and identifiers for resources
// 3.1. set server location
const MANIFEST_SERVER = 'http://localhost:8887' // location for Web Server for Chrome
const IMAGE_SERVER = 'http://localhost:8182'
const ITEM = '18'
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
  imageServer: IMAGE_SERVER,
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

/**
 * build pyramid tiff and manifest for item 1 
 */
createTiff(collection, ITEM, TIFF_DEST) 
  .then(info => {
    console.log('image info:', info)
    buildManifest(MANIFEST_CONFIG) 
  })
  .catch(err => console.error(err))
