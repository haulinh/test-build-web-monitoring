import React from 'react'
import { ShareApiContext } from './layout/ApiSharingLayout'

const withShareApiContext = Component => {
  return props => {
    return (
      <ShareApiContext.Consumer>
        {context => <Component {...props} {...context} />}
      </ShareApiContext.Consumer>
    )
  }
}

export default withShareApiContext
