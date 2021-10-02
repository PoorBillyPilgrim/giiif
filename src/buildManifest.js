import { ManifestFactory } from './manifest/index.js'
import axios from 'axios'

/**
 * Simple module for generating a IIIF Manifest for a single image
 * served from a IIIF image server
 */

// params for different resources within manifest
const ITEM_URL = 'http://localhost:8887' // location for Web Server for Chrome
const MANIFEST_CONFIG = {
  manifest: {
    id: `${ITEM_URL}/manifestTest.json`,
    label: { en: ['this is a test label'] }
  },
  canvas: {
    id: `${ITEM_URL}/canvas`,
    label: 'Canvas with a single IIIF image'
  },
  annotation: {
    id: `${ITEM_URL}/annotation`
  },
  annotationPage: {
    id: `${ITEM_URL}/page`
  }
}

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

  manifest.toFile({
    compact: false,
    file: './manifestTest.json'
  })

  console.log('-----Manifest created-----')
}

buildManifest(MANIFEST_CONFIG)
