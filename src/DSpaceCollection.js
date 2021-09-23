// The Promise API is only availble via dot notation prior to node v14.0.0
import * as fs from 'fs/promises';
//import fs from 'fs'
//import * as XMLconverter from 'xml-js';
//const COLLECTIONS = './collections';

/** Class representating a DSpace collection */
class DSpaceCollection {

    /**
     * Create a DSpace collection
     * @param {String} src - file path to folder containing DSpace dublin_core.xml and image 
     */
    constructor(src) {
        this.src = src;
        this.items();
    }

    /** add collection src items as an object of arrays */
    async items() {
        try {
            const items = await fs.readdir(this.src, { encoding: 'utf-8', withFileTypes: true });
            for (let item of items) {
                if (item.isDirectory()) {
                    this.items[item.name] = await fs.readdir(this.src +'/' + item.name, 'utf-8')
                }
            }
            return this.items
        } catch (err) {
            console.error(err)
        }
    }

    /*async getItems(collection) {
        
    }*/
}

const collection = new DSpaceCollection('../../collections/collection_67')
collection.items().then((items) => console.log(items))

//console.log(collection.items['1'])

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
}*/
