import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import { shareApiList } from './constants'
import ApiSharingLayout from './layout/ApiSharingLayout'
import {
  HistoryDataCreate,
  HistoryDataEdit,
} from './page/station-auto/history-data'
import {
  NewestDataCreate,
  NewestDataEdit,
} from './page/station-auto/newest-data'
import {
  NewestDataStationFixedCreate,
  NewestDataStationFixedEdit,
} from './page/station-fixed/newest-data'

const ApiSharingRoute = () => {
  return (
    <ApiSharingLayout>
      <Switch>
        <Route
          exact
          path={`${slug.apiSharing.base}/:apiKey`}
          component={ApiSharingDetailList}
        />

        {/**Station Auto**/}
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.newestData.key}/create`}
          component={NewestDataCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.newestData.key}/edit/:id`}
          component={NewestDataEdit}
        />

        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.historyData.key}/create`}
          component={HistoryDataCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.historyData.key}/edit/:id`}
          component={HistoryDataEdit}
        />

        {/**Station Fixed**/}
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestData.key}/create`}
          component={NewestDataStationFixedCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestData.key}/edit/:id`}
          component={NewestDataStationFixedEdit}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
