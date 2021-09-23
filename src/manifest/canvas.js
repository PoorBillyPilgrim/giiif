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
    this.label = { en: [info.label] }
    this.height = info.height
    this.width = info.width
  }
}

export default Canvas
