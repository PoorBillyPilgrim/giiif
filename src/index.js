import tiff from './tiff.js'

const options = {
  src: '/Users/tjjones93/Google Drive/iiif-research-project/collections/collection_67/1/vac4-231-1.jpg',
  dest: 'test.tif',
  isPyramid: {
    tile: true,
    pyramid: true
  }
}

tiff(options)
  .then(info => console.log(info))
  .catch(err => console.error(err))
