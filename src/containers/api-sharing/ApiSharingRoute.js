import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import { shareApiList } from './constants'
import ApiSharingLayout from './layout/ApiSharingLayout'
import {
  HistoryDataCreate,
  HistoryDataEdit,
} from './page/data-station-auto/history-data'
import {
  NewestDataCreate,
  NewestDataEdit,
} from './page/data-station-auto/newest-data'

const ApiSharingRoute = () => {
  return (
    <ApiSharingLayout>
      <Switch>
        <Route
          exact
          path={`${slug.apiSharing.base}/:apiKey`}
          component={ApiSharingDetailList}
        />

        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.newestData.key}/create`}
          component={NewestDataCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.newestData.key}/edit/:id`}
          component={NewestDataEdit}
        />

        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.historyData.key}/create`}
          component={HistoryDataCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.historyData.key}/edit/:id`}
          component={HistoryDataEdit}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
