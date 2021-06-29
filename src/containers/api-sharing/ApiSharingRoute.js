import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailCreate from './api-sharing-detail/ApiSharingDetailCreate'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import ApiSharingLayout from './layout/ApiSharingLayout'

const ApiSharingRoute = () => {
  return (
    <ApiSharingLayout>
      <Switch>
        <Route
          exact
          path={slug.apiSharing.base}
          component={ApiSharingDetailList}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/:apiKey`}
          component={ApiSharingDetailList}
        />
        <Route
          path={`${slug.apiSharing.base}/:apiKey/create`}
          component={ApiSharingDetailCreate}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
