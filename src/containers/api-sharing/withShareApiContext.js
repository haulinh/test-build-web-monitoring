import React from 'react'
import { ApiSharingDetailContext } from './component/ApiSharingDetail'
import { ShareApiContext } from './layout/ApiSharingLayout'

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
