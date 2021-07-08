import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import { shareApiList } from './constants'
import ApiSharingLayout from './layout/ApiSharingLayout'
import {
  HistoryDataStationAutoCreate,
  HistoryDataStationAutoEdit,
  HistoryDataStationAutoView,
} from './page/station-auto/history-data'
import {
  NewestDataCreate,
  NewestDataEdit,
} from './page/station-auto/newest-data'
import {
  HistoryDataStationFixedEdit,
  HistoryDataStationFixedCreate,
  HistoryDataStationFixedView,
} from './page/station-fixed/history-data'
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
          component={HistoryDataStationAutoCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.historyData.key}/edit/:id`}
          component={HistoryDataStationAutoEdit}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.historyData.key}/:id`}
          component={HistoryDataStationAutoView}
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

        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyData.key}/create`}
          component={HistoryDataStationFixedCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyData.key}/edit/:id`}
          component={HistoryDataStationFixedEdit}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyData.key}/:id`}
          component={HistoryDataStationFixedView}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
