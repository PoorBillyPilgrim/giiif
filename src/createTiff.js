// 2. create pyramid TIFF
import sharp from 'sharp'
import * as path from 'path'
export const createTiff = async (collection, item, dest) => {
    // 2.1. get image path and file name for item
    const { parse, imagePath } = await collection.parseItemImage(item)
    // 2.2. convert image to Pyramid TIFF and name as file name without original ext
    return sharp(imagePath)
      .tiff({ tile: true, pyramid: true })
      .toFile(path.resolve(dest, `${parse.name}.tif`))
  }
