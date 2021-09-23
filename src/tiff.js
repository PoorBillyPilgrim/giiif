export const tiff = (image) => {
  sharp(image)
    .tiff({
      tile: true,
      pyramid: true
    })
    .toFile('./test.tif')
    .then(info => console.log(info))
    .catch(err => console.error(err))
}
