/** Class to be inherited by all IIIF resource types */
class Template {
  /**
     * Create a resource template
     * @param {String} id - unique URL for resource type
     * @param {String} type - resource type, eg. Manifest, Canvas, Annotation
     */
  constructor (id, type) {
    if (type === 'Presentation' || type === 'Manifest') this['@context'] = 'http://iiif.io/api/presentation/3/context.json'
    this.id = id
    this.type = type
  }

  /**
   * 
   * @param {string} url 
   */
  setId (url) {
    if (typeof url !== 'string') throw new Error('url value must be a string')
    this.id += url
  }

  /**
     * Add items Array to IIIF resource
     * @param {IIIF Resource} items - IIIF resource created from ManifestFactory module
     */
  addItems (items) {
    if (!this.hasOwnProperty('items')) {
      this.items = []
      this.items.push(items)
    } else {
      console.error('items property already exists. You can only add one item at this time.')
    }
  }
}

export default Template
