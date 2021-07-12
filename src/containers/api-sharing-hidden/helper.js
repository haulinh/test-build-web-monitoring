import { getConfigApi } from 'config'
import { getAuthToken } from 'utils/auth'

export function generateGetUrl(params) {
  const { endpoint, extraEndpoint } = params
  const apiGateway = getConfigApi().gateway
  const accessToken = getAuthToken()
  const fullEndpoint = `${apiGateway}${extraEndpoint || endpoint}`

  return `curl '${fullEndpoint}' \
            -H 'authorization: ${accessToken}'`
}