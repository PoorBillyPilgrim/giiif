// The Promise API is only availble via dot notation prior to node v14.0.0
import * as fs from 'fs/promises'
import * as XMLconverter from 'xml-js'
//import tiff from 'tiff.js';
// const COLLECTIONS = './collections';

/** Class representating a DSpace collection */
class DSpaceCollection {
  /**
     * Create a DSpace collection
     * @param {String} src - file path to folder containing DSpace dublin_core.xml and image
     */
  constructor (src) {
    this.src = src
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
          const files = await fs.readdir(this.src + '/' + item.name, 'utf-8')
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
   * @param {string} id - Folder name for item in collection
   * @returns {Promise} - Promise object representing Array containing names for files in item folder
   */
  async getItem(id) {
    let items = await this.items()
    return new Promise((resolve, reject) => {
      resolve(items[id]);
    })
  }

  /**
     * @param {Object} item
     * @returns {Promise} - Promise object represents XML metadata
    */
  async metadata (id) {
    try {
      const metadata = await fs.readFile(`${this.src}/${id}/dublin_core.xml`, 'utf-8')
      return metadata
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * returns dcvalue from dublin_core.xml
   * @param {Object} metadata - Promise returned from this.object()
   * @param {String} element - dcvalue.element (eg. identifier)
   * @param {String} qualifier - dcvalue.qualifier (eg. gtid)
   * @returns {Promise} - Promise representing dcvalue as a string
   */
   async getDcvalue (item, element, qualifier) {
    let value
    const metadata = await this.getItemMetadata(item)
    metadata.dublin_core.dcvalue.forEach((dcvalue) => {
        if (dcvalue._attributes.element.toLowerCase() === element.toLowerCase() && dcvalue._attributes.qualifier.toLowerCase() === qualifier.toLowerCase()) {
          value = dcvalue._text.toLowerCase()
        }
      })
    return value
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
   * @param {String} item - index of item in collection 
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
   * @param {String} item - index of item in collection
   * @returns {Promise} - Promise object represents JS object for one item
   */
  async getItemMetadata (item) {
    const metadata = await this.metadata(item)
    const object = await this.object(metadata)
    return object
  }


}

// create a DSpaceCollection instance
const collection = new DSpaceCollection('../../collections/collection_67')

// return XML as JSON
//collection.getItemJson('1').then(json => console.log(json))

// return XML of first item in collection as JS Object
//collection.getItemMetadata('1').then(obj => console.log(obj))

// return GTid of first item in collection
/*collection
  .getDcvalue('1', 'identifier', 'GTid')
  .then(value => console.log(value))*/

collection
  .getDcvalue('1', 'identifier', 'GTid')
  .then(value => {
    let index = value.search(/-|_/)
    let id = value.slice(index + 1)
    return id
  })
  .then(async (id) => {
    let regex = new RegExp(id)
    const item = await collection.getItem(('1'))
    item.forEach(file => {
      if (regex.test(file)) {
        console.log(file)
      }
    })
  })
// 
/*collection.getItemMetadata('1')
  .then(metadata => {
    console.log(collection.dcvalue(metadata, 'identifier', 'GTid'))
  })*/
/*getMetadata(collection)
  .then(metadata => { 
    console.log(collection.dcvalue(metadata, 'identifier', 'GTid'))
  })*/

/*let arr = [
  {'name': {'first': 'Tyler'}},
  {'name': {'first': 'Sarah'}}
]

arr.find(el=> {
  console.log(el.name.first.match(/Sarah/))
})*/
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
