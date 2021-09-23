// The Promise API is only availble via dot notation prior to node v14.0.0
import * as fs from 'fs/promises';
import * as XMLconverter from 'xml-js';
//const COLLECTIONS = './collections';

/** Class representating a DSpace collection */
class DSpaceCollection {

    /**
     * Create a DSpace collection
     * @param {String} src - file path to folder containing DSpace dublin_core.xml and image 
     */
    constructor(src) {
        this.src = src;
    }

    /** add collection src items as an object of arrays */
    async items() {
        try {
            let contents = [];
            const items = await fs.readdir(this.src, { encoding: 'utf-8', withFileTypes: true });
            for (let item of items) {
                if (item.isDirectory()) {
                    let files = await fs.readdir(this.src +'/' + item.name, 'utf-8')
                    let entry = {id: item.name, files: files}
                    contents.push(entry)
                }
            }
            return contents
        } catch (err) {
            console.error(err)
        }
    }

    /** 
     * Print metadata file 
     * currently prints metadata file for item 1
    */
    async metadata(item) {
        try {
            let metadata = await fs.readFile(this.src + '/' + item.id + '/' + item.files[2], 'utf-8')
            return metadata;
        } catch (err) {
            console.error(err)
        }
    }

    async json(file) {
        return new Promise((resolve, reject) => {
            const json = XMLconverter.xml2json(file, {compact: true, spaces: 4});
            resolve(json);
        })
    }
}

const collection = new DSpaceCollection('../../collections/collection_67')
//console.log(collection.items().then((items) => collection.metadata(items[0])))

const printJSON = async (collection) => {
    let items = await collection.items();
    let metadata = await collection.metadata(items[0]);
    let json = await collection.json(metadata);
    console.log(json)
}

printJSON(collection)
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
