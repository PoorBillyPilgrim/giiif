import fs from 'fs'
import Template from './template.js'
/**
 * Class representing Manifest resource type
 * @extends Template
 */
class Manifest extends Template {
  /**
     * Create a Manifest
     * @param {Object} info
     * @param {string} info.id - unique URL for resource type
     */
  constructor (info) {
    super(info.id, 'Manifest')
    this.label = info.label
  }

  /**
     * Write Manifest to file
     * @param {Object} info
     * @param {boolean} info.compact - true to reduce file size, false for human readability
     * @param {string} info.file - file path
     */
  toFile (info) {
    const spaces = info.compact ? 0 : 2
    fs.writeFileSync(info.file, JSON.stringify(this, null, spaces))
  }

  /**
     * Add metadata property to Manifest
     * @param {Object} src - should be from a dublin_core.xml file
     */
  setMetadata (src) {
    this.metadata = [src]
  }

  /** Log Manifest to console */
  print () {
    console.log(this)
  }
}

export default Manifest
