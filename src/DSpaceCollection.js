// The Promise API is only availble via dot notation prior to node v14.0.0
import * as fs from 'fs/promises'
import * as path from 'path'
import * as XMLconverter from 'xml-js'
// import tiff from 'tiff.js';
//const collectionsDir = path.

/** Class representating a DSpace collection */
class DspaceCollection {
  /**
     * Create a DSpace collection
     * @param {String} src - file path to folder containing DSpace dublin_core.xml and image
     */
  constructor (src) {
    this.src = src
  }




  /**
   * 
   * @param {item} item 
   * @returns 
   */
  itemPath (item) {
    if (typeof item !== 'string') throw new Error("item must be a string")
    return path.join(this.src, item)
  }

  /**
   * @returns {Promise} - Promise array represents contents of collection
   */
  async items () {
    try {
      const contents = {}
      const items = await fs.readdir(this.src, { encoding: 'utf-8', withFileTypes: true })
      for (const item of items) {
        if (item.isDirectory()) {
          const files = await fs.readdir(path.join(this.src, item.name), 'utf-8')
          contents[item.name] = files
        }
      }
      return contents
    } catch (err) {
      console.error(err)
    }
  }

  /**
   *
   * @param {string} item - folder name for item in collection
   * @returns {Promise} - Promise object representing Array containing names for files in item folder
   */
  async getItem (item) {
    const items = await this.items()
    return new Promise((resolve, reject) => {
      if (typeof item !== 'string') reject(new Error("item must be a string"))
      resolve(items[item])
    })
  }

  /**
     * @param {Object} item - folder name for item
     * @returns {Promise} - Promise object represents XML metadata
    */
  async metadata (item) {
    try {
      if (typeof item !== 'string') throw new Error("item must be a string")
      const metadata = await fs.readFile(path.join(this.src, item, 'dublin_core.xml'), 'utf-8')
      return metadata
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * returns dcvalue from dublin_core.xml
   *
   * @param {Object} options
   * @param {Object} options.item - folder name for item in collection
   * @param {String} options.element - dcvalue.element (eg. identifier)
   * @param {String} options.qualifier - dcvalue.qualifier (eg. gtid)
   * @returns {Promise} - Promise representing dcvalue as a string
   */
  async getDcvalue (options) {
    let value
    const metadata = await this.getItemMetadata(options.item)
    metadata.dublin_core.dcvalue.forEach((dcvalue) => {
      if (dcvalue._attributes.element.toLowerCase() === options.element.toLowerCase() && dcvalue._attributes.qualifier.toLowerCase() === options.qualifier.toLowerCase()) {
        value = dcvalue._text.toLowerCase()
      }
    })
    return value
  }

  /**
   * 
   * @param {Object} options 
   * @param {} options.item
   * @param {Array} options.descriptions - Array with dcvalues to be returned
   * @returns 
   */
  async getDescriptiveMetadata (options) {
    let values = []
    const metadata = await this.getItemMetadata(options.item)
    metadata.dublin_core.dcvalue.forEach((dcvalue) => {
      options.descriptions.forEach(description => {
        if (dcvalue._attributes.element.toLowerCase() === description.element.toLowerCase() && dcvalue._attributes.qualifier.toLowerCase() === description.qualifier.toLowerCase()) {
          let label = description.qualifier === 'none' ? description.element : description.qualifier
          let jsonld = {
            "label": { "en" : [label] },
            "value": { "en" : [dcvalue._text] }
          }
          values.push(jsonld)
        }
      })
    })
    return values
  }

  /**
   * @param {String} file - An XML string
   * @returns {Promise} Promise object represents JSON
   */
  async json (file) {
    return new Promise((resolve, reject) => {
      const json = XMLconverter.xml2json(file, { compact: true, spaces: 4 })
      resolve(json)
    })
  }

  /**
   *
   * @param {String} item - folder name of item in collection
   * @returns {Promise} - Promise object representing JSON for one item
   */
  async getItemJson (item) {
    const metadata = await this.metadata(item)
    const json = await this.json(metadata)
    return json
  }

  /**
   * @param {String} file - An XML string
   * @returns {Promise} Promise object represents JSON
   */
  async object (file) {
    return new Promise((resolve, reject) => {
      const object = XMLconverter.xml2js(file, { compact: true, spaces: 4 })
      resolve(object)
    })
  }

  /**
   * @param {String} item - folder name of item in collection
   * @returns {Promise} - Promise object represents JS object for one item
   */
  async getItemMetadata (item) {
    const metadata = await this.metadata(item)
    const object = await this.object(metadata)
    return object
  }

  /**
   * @param {String} item - folder name for item in collection
   * @returns {String} file name for image
   */
  async getItemImage (item) {
    let image
    const value = await this.getDcvalue({item: item, element: 'identifier', qualifier: 'gtID'})
    const index = value.search(/-|_/)
    const id = value.slice(index + 1)
    const idRegex = new RegExp(id)
    const folder = await collection.getItem(item)
    folder.forEach(file => {
      const singleExtension = /^[^.]+\.[^.]+$/ // returns string with only one period, explanation: https://regex101.com/r/gDGQu3/1
      if (idRegex.test(file) && singleExtension.test(file)) {
        image = file
      }
    })
    return image
  }

  /**
   * 
   * @param {String} item 
   * @returns 
   */
  async parseItemImage (item) {
    let image = await this.getItemImage(item)
    let imagePath = path.resolve(this.itemPath(item), image)
    return path.parse(imagePath)
  }
}

// create a DspaceCollection instance
const collection = new DspaceCollection('../../collections/collection_67')
//collection.getItem(1).then(met => console.log(met)).catch(err => console.log(err))
//collection.items().then(items => console.log(items))
/*const descriptions = [
  {'element': 'title', 'qualifier': 'none'},
  {'element': 'contributor', 'qualifier': 'author'},
  {'element': 'date', 'qualifier': 'none'}
]
collection.getDescriptiveMetadata({
  item: '1',
  descriptions: descriptions
}).then(values => console.log(JSON.stringify(values, null, 2)))
//collection.getItemImage('20').then(image => console.log(image))
/*collection
  .getItemMetadata('1')
  .then(xml => {
    const descriptions = [
      {'element': 'title', 'qualifier': 'none'},
      {'element': 'contributor', 'qualifier': 'author'},
      {'element': 'date', 'qualifier': 'none'}
    ]

    
    xml.dublin_core.dcvalue.forEach(value => console.log(value))
  })
// return XML as JSON
// collection.getItemJson('1').then(json => console.log(json))

// return XML of first item in collection as JS Object
// collection.getItemMetadata('1').then(obj => console.log(obj))

// return GTid of first item in collection
/* collection
  .getDcvalue('1', 'identifier', 'GTid')
  .then(value => console.log(value)) */

/**
 * returns the GTid of the first item in the collection
 * then parses that GTid and extracts trailing identifier, i.e. removes collection name prefix
 * then gets all contents of first item and returns src image
 * I can then pass this file name to sharp to create a pyramid tiff
 */
console.log(collection.itemPath('1'))
/* collection
  .getDcvalue({item: '1', element: 'identifier', qualifier: 'GTid'})
  .then(value => {
    let index = value.search(/-|_/)
    let id = value.slice(index + 1)
    return id
  })
  .then(async (id) => {
    let idRegex = new RegExp(id)
    const item = await collection.getItem(('1'))
    item.forEach(file => {
      let singleExtension = new RegExp(/^[^.]+\.[^.]+$/) // returns string with only one period, explanation: https://regex101.com/r/gDGQu3/1
      if (idRegex.test(file) && singleExtension.test(file)) {
        console.log(file)
      }
    })
  }) */
//
/* collection.getItemMetadata('1')
  .then(metadata => {
    console.log(collection.dcvalue(metadata, 'identifier', 'GTid'))
  }) */
/* getMetadata(collection)
  .then(metadata => {
    console.log(collection.dcvalue(metadata, 'identifier', 'GTid'))
  }) */

/* let arr = [
  {'name': {'first': 'Tyler'}},
  {'name': {'first': 'Sarah'}}
]

arr.find(el=> {
  console.log(el.name.first.match(/Sarah/))
}) */
/*

const convertFiles = (folders) => {
    return folders.map(folder => {
        let src = `${COLLECTIONS}/collection_67/${folder}/dublin_core.xml`;
        let dest = `./converted/${folder}.json`;
        write(src, dest)
    });

}

const readFile = async (path) => {
    try {
        let file = await fs.readFile(path, 'utf-8');
        return file;
    } catch (err) {
        console.error(err)
    }
}

const convert = (file) => {
    return new Promise((resolve, reject) => {
        const json = XMLconverter.xml2json(file, {compact: true, spaces: 4});
        resolve(json);
    })
}

const write = async (src, dest) => {
    try {
        let file = await readFile(src);
        let json = await convert(file);
        let promise = await fs.writeFile(dest, json);
        return promise;
    } catch (err) {
        console.error(err);
    }
} */
