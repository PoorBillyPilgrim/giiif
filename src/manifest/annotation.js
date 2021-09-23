import Template from './template.js'
/**
 * Class representing Annotation resource type
 * @extends Template
 */
class Annotation extends Template {
  /**
     * Create an Annotation
     * @param {Object} info
     * @param {string} info.id - unique URL for resource type
     */
  constructor (info) {
    super(info.id, 'Annotation')
    this.motivation = 'painting'
    this.body = {
      id: null,
      type: 'Image',
      format: 'image/jpeg'
    }
    this.target = null
  }

  setTarget (canvas) {
    this.target = canvas
  }
}

export default Annotation
