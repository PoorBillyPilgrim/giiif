import Template from './template.js'
/**
 * Class representing AnnotationPage resource type
 * @extends Template
 */
class AnnotationPage extends Template {
  /**
     * Create an AnnotationPage
     * @param {Object} info
     * @param {string} info.id - unique URL for resource type
     */
  constructor (info) {
    super(info.id, 'AnnotationPage')
  }
}

export default AnnotationPage
