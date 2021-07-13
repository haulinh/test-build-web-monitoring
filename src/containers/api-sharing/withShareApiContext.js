import React from 'react'
import { ShareApiContext } from './layout/ApiSharingLayout'
import { ApiSharingDetailContext } from './page/station-auto/history-data/form/ApiSharingDetail'

export const withShareApiContext = Component => {
  return props => {
    return (
      <ShareApiContext.Consumer>
        {context => <Component {...props} {...context} />}
      </ShareApiContext.Consumer>
    )
  }
}

export const withApiSharingDetailContext = Component => {
  return props => {
    return (
      <ApiSharingDetailContext.Consumer>
        {context => <Component {...props} {...context} />}
      </ApiSharingDetailContext.Consumer>
    )
  }
}
