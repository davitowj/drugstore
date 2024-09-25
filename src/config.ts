import path from "path"
// define address / path of root folder 
const ROOT_DIRECTORY = `${path.join(__dirname, `../`)}`

/**
 * __dirname: mendapatkan posisi dari folder pada file ini(config.ts) -> pada folder "src"
 * "../" artinya adalah mundur satu folder kebelakang
 */

export { ROOT_DIRECTORY }