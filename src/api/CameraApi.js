import { getConfigApi } from 'config'
// import { getFetch, putFetch } from 'utils/fetch'
import axios from 'axios'
import md5Hex from 'crypto-js/md5'
import { Base64 } from 'js-base64'

const method = 'GET'

function getInfo() {
  const instance = axios.create({
    baseURL: getConfigApi().camera.host,
  })
  // console.log('getInfo', instance, getConfigApi())
  const username = getConfigApi().camera.username
  const password = getConfigApi().camera.password
  return {
    instance,
    username,
    password,
  }
}

async function getNone() {
  try {
    const response = await getInfo().instance.get('/api/getNonce')
    if (response.data.error === '0') return response.data.reply
    else return response.data.error
  } catch (error) {
    console.error(error)
  }
}

export function getThumbLink(cameraId, auth) {
  return `${
    getConfigApi().camera.host
  }/ec2/cameraThumbnail?cameraId=${cameraId}&time=LATEST&auth=${auth}&width=480&height=320`
}

export function getCameraMPJEGLink(cameraId, auth, resolution) {
  return `${
    getConfigApi().camera.host
  }/media/${cameraId}.mpjpeg?resolution=${resolution}&auth=${auth}`
}

export async function getAuthToken() {
  const { username, password } = getInfo()
  // cookieLogin()
  let cameraNone = await getNone()
  let digest = md5Hex(username + ':' + cameraNone.realm + ':' + password)
  let partial_ha2 = md5Hex(method + ':')
  let simplified_ha2 = md5Hex(
    digest + ':' + cameraNone.nonce + ':' + partial_ha2
  )
  let auth_digest = Base64.encode(
    username + ':' + cameraNone.nonce + ':' + simplified_ha2
  )
  // console.log('digest',digest)
  // console.log('partial_ha2',partial_ha2)
  // console.log('simplified_ha2',simplified_ha2)
  // console.log('auth_digest',auth_digest)

  // let link = `https://cameraazu.ilotusland.website/media/d6ae75cd-4255-cfe6-86f3-bd973c44d7a9.webm?auth=${auth_digest}&resolution=360p&sfd&rt`
  // console.log('let,',link)
  window.auth_camera = auth_digest
  return auth_digest
}

export default {
  getAuthToken: getAuthToken,
}
