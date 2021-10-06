//import { Resources } from './manifest/resources.js'
//import { DspaceCollection } from './DspaceCollection.js'
import { build } from './build.js'
import { createTiff } from './createTiff.js'
//import * as path from 'path'

/**
 * @module ManifestFactory
 * Simple module for generating a IIIF Manifest for a single image
 * served from a IIIF image server
 */


export class ManifestFactory {
  constructor(collection, manifestConfig) {
    this.collection = collection
    this.manifestConfig = manifestConfig
  }

  build () {
    console.log('hello')
  }
}
