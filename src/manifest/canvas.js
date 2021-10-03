import Template from './template.js'
/**
 * Class representing Canvas resource type
 * @extends Template
 */
class Canvas extends Template {
  /**
     * Create a Canvas
     * @param {Object} info
     * @param {string} info.id - unique URL for resource type
     */
  constructor (info) {
    super(info.id, 'Canvas')
    this.label = { en: [] }
    this.height = info.height
    this.width = info.width
  }

  /**
   * @param {String} label
   */
  setLabel (label) {
    if (typeof label !== 'string') throw new Error('label value must be a string')
    this.label.en = [label]
  }
}

export default Canvas
