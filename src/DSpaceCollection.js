// The Promise API is only availble via dot notation prior to node v14.0.0
import * as fs from 'fs/promises';
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
    }

    async printContents() {
        try {
            const contents = await fs.readdir(this.src, 'utf-8');
            console.log(contents.splice(1)); // remove .DS_Store
            //console.log(contents);
        } catch (err) {
            console.error(err);
        }
    }
}

const collection = new DSpaceCollection('../../collections/collection_67')
collection.printContents()

/*readCollection('collection_67')
    .then(folders => { 
        return convertFiles(folders);
    })
    .then(() => console.log("files converted"))
    .catch(err => console.error(err))


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
