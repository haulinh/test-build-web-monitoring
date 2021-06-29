import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import ApiSharingContainer from './ApiSharingContainer'

const ApiSharingRoute = () => {
  return (
    <Switch>
      <Route
        exact
        path={slug.apiSharing.base}
        component={ApiSharingContainer}
      />
      <Route
        path={`${slug.apiSharing.base}/:apiKey`}
        component={ApiSharingDetailList}
      />
    </Switch>
  )
}

export default ApiSharingRoute
