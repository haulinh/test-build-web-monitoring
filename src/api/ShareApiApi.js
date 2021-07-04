import { getConfigApi } from 'config'
import { deleteFetch, getFetch, postFetch } from 'utils/fetch'

const prefixCategory = () => getConfigApi().category

const routes = {
  getConfig: () => `${prefixCategory()}/share-api/config`,
  getApiListByKey: key => `${prefixCategory()}/share-api/${key}`,
  getApiDetailById: id => `${prefixCategory()}/share-api/${id}`,
}

export const shareApiApi = {
  getConfig: () => {
    const route = routes.getConfig()
    return getFetch(route)
  },

  getApiListByKey: key => {
    const route = routes.getApiListByKey(key)
    return getFetch(route)
  },

  deleteApiDetailById: id => {
    const route = routes.getApiDetailById(id)
    return deleteFetch(route)
  },

  createApiByKey: (key, params) => {
    const route = routes.getApiListByKey(key)
    return postFetch(route, params)
  },
}
