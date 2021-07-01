import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  ApiSharingDetailList,
  ApiSharingDetailCreate,
  ApiSharingDetailEdit,
} from './api-sharing-detail'

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
          exact
          path={`${slug.apiSharing.base}/:apiKey/create`}
          component={ApiSharingDetailCreate}
        />
        <Route
          path={`${slug.apiSharing.base}/:apiKey/edit`}
          component={ApiSharingDetailEdit}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
