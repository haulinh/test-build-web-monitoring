import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

export function getMediaUrl(prefix = '') {
  return getConfigApi().media + '/' + prefix
}

export function getMinio(prefix = '') {
  return getConfigApi().media + '/' + prefix
}

export function getImages(databaseName, stationName) {
  const url = `${
    getConfigApi().minio
  }/buckets/${databaseName}?prefix=${stationName}/`
  return getFetch(url)
}

export function generatePutUrl(databaseName) {
  const url = `${
    getConfigApi().minio
  }/buckets/${databaseName}/presigned-put-object`
  return url
}

export function getUrlImage() {
  return getConfigApi().mediaMinio
}

export function urlPhotoUploadWithDirectory(directory) {
  return getMediaUrl(`photo/uploadWithDirectory/${directory}`)
}

export default {
  urlPhotoUploadWithDirectory,
  getMediaUrl,
  getImages,
  generatePutUrl,
  getUrlImage
}
