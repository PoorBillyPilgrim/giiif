import Template from './template.js'
/**
 * Class representing Annotation resource type
 * @extends Template
 */
class Annotation extends Template {
  /**
     * Create an Annotation
     * @param {Object} info
     * @param {String} info.id - unique URL for resource type
     */
  constructor (info) {
    super(info.id, 'Annotation')
    this.motivation = 'painting'
    this.body = {
      id: null, // should be entire Image API URL, or if not from IIIF image server, just actual location of image
      type: null,
      format: null,
      height: null,
      width: null,
      service: []
    }
    this.target = null
  }

  setTarget (canvas) {
    this.target = canvas
  }

  setBody (options) {
    this.body.id = options.id
    this.body.type = options.type
    this.body.format = options.format
    this.body.height = options.height
    this.body.width = options.width
    this.body.service.push(options.service)
  }

  /**
   *
   * @param {String} path
   */
  setImagePath (path) {

  }
}

export default Annotation
