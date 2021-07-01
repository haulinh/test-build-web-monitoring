import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ApiSharingDetailList from './api-sharing-detail/ApiSharingDetailList'
import { shareApiList } from './constants'
import ApiSharingLayout from './layout/ApiSharingLayout'
import { NewestDataCreate } from './page/data-station-auto/newest-data'

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
          path={`${slug.apiSharing.base}/${shareApiList.stationAuto.key}/create`}
          // component={ApiSharingDetailCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.stationFixed.key}/create`}
          // component={ApiSharingDetailCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.aqiStationAuto.key}/create`}
          // component={ApiSharingDetailCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.wqiStationFixed.key}/create`}
          // component={ApiSharingDetailCreate}
        />
        <Route
          exact
          path={`${slug.apiSharing.base}/${shareApiList.newestData.key}/create`}
          component={NewestDataCreate}
        />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
