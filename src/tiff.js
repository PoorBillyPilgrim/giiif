import sharp from 'sharp'

const tiff = async (options) => {
  return sharp(options.src)
    .tiff(options.isPyramid)
    .toFile(options.dest)
}

export default tiff
