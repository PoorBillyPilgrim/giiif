import axios from 'axios'

const info = async (url) => {
    const res = await axios.get(url)
    return {
        id: res.data.id,
        service: res.data,
        height: res.data.height,
        width: res.data.width
    }
}

info('http://localhost:8182/iiif/3/image.tif/info.json')
    .then(data => console.log(data))