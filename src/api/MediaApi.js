import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'
import { PATH_FOLDER } from 'constants/media'
import { deleteFetch } from 'utils/fetch'

const generateMinioUrl = (databaseName, prefix) =>
  `${getConfigApi().minio}/buckets/${databaseName}?prefix=${prefix}/`

export function getMediaUrl(prefix = '') {
  return getConfigApi().media + '/' + prefix
}

export function getMinio(prefix = '') {
  return getConfigApi().media + '/' + prefix
}

export function getImages(databaseName, stationKey) {
  const url = `${
    getConfigApi().minio
  }/buckets/${databaseName}?prefix=/${stationKey}/${PATH_FOLDER}/`
  return getFetch(url)
}

export function getAttachment(databaseName, id) {
  const url = generateMinioUrl(databaseName, `/ticket/${id}`)
  return getFetch(url)
}

export function deleteAttachment(databaseName, id, name) {
  const url = `${
    getConfigApi().minio
  }/buckets/${databaseName}?prefix=ticket/${id}/${name}`
  return deleteFetch(url)
}

export function deleteImage(databaseName, stationKey, name) {
  const url = `${
    getConfigApi().minio
  }/buckets/${databaseName}?prefix=${stationKey}/${PATH_FOLDER}/${name}`
  return deleteFetch(url)
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
  getUrlImage,
  deleteImage,
  getAttachment,
  deleteAttachment,
}
