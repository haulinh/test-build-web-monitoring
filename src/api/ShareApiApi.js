import { getConfigApi } from 'config'
import { getFetch, postFetch } from 'utils/fetch'

const prefixCategory = () => getConfigApi().category

const routes = {
  getConfig: () => `${prefixCategory()}/share-api/config`,
  getApiListByKey: key => `${prefixCategory()}/share-api/${key}`,
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

  createApiByKey: (key, params) => {
    const route = routes.getApiListByKey(key)
    return postFetch(route, params)
  },
}
