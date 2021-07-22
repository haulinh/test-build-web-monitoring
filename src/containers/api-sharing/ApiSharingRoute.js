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
  NewestDataStationAutoCreate,
  NewestDataStationAutoEdit,
  NewestDataStationAutoView,
} from './page/station-auto/newest-data'

import {
  HistoryDataStationFixedEdit,
  HistoryDataStationFixedCreate,
  HistoryDataStationFixedView,
} from './page/station-fixed/history-data'
import {
  NewestDataStationFixedCreate,
  NewestDataStationFixedEdit,
  NewestDataStationFixedView,
} from './page/station-fixed/newest-data'
import {
  NewestWqiStationFixedCreate,
  NewestWqiStationFixedEdit,
  NewestWqiStationFixedView,
} from './page/station-fixed/newest-wqi'
import {
  HistoryWqiStationFixedCreate,
  HistoryWqiStationFixedEdit,
  HistoryWqiStationFixedView,
} from './page/station-fixed/history-wqi'
import {
  NewestDataWeatherCreate,
  NewestDataWeatherEdit,
  NewestDataWeatherView,
} from './page/weather/newest-data'
import {
  FeatureDataWeatherCreate,
  FeatureDataWeatherEdit,
  FeatureDataWeatherView,
} from './page/weather/feature-data'
import { connect } from 'react-redux'
import _ from 'lodash'

function mapStateToProps(state) {
  const enableShareAPI = _.get(state, [
    'auth',
    'userInfo',
    'organization',
    'enableShareAPI',
  ])
  return { enableShareAPI }
}

const ApiSharing = connect(mapStateToProps)(({ enableShareAPI }) => {
  if (!enableShareAPI) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src="/images/NoAPIShare.svg" alt="no-api-share" />
      </div>
    )
  }

  return (
    <React.Fragment>
      {/* <Route
          exact
          path={`${slug.apiSharing.base}`}
          component={ApiSharingDetailList}
        /> */}

      <Route
        exact
        path={`${slug.apiSharing.base}/:apiKey`}
        component={ApiSharingDetailList}
      />

      {/**Station Auto**/}
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationAuto.newestData.key}/create`}
        component={NewestDataStationAutoCreate}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationAuto.newestData.key}/edit/:id`}
        component={NewestDataStationAutoEdit}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationAuto.newestData.key}/:id`}
        component={NewestDataStationAutoView}
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
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestData.key}/:id`}
        component={NewestDataStationFixedView}
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
      {/** History WQI */}
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyWqi.key}/create`}
        component={HistoryWqiStationFixedCreate}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyWqi.key}/edit/:id`}
        component={HistoryWqiStationFixedEdit}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.historyWqi.key}/:id`}
        component={HistoryWqiStationFixedView}
      />
      {/** Newest WQI */}
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestWqi.key}/create`}
        component={NewestWqiStationFixedCreate}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestWqi.key}/edit/:id`}
        component={NewestWqiStationFixedEdit}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.stationFixed.newestWqi.key}/:id`}
        component={NewestWqiStationFixedView}
      />

      {/**Weather **/}
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.newestData.key}/create`}
        component={NewestDataWeatherCreate}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.newestData.key}/edit/:id`}
        component={NewestDataWeatherEdit}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.newestData.key}/:id`}
        component={NewestDataWeatherView}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.featureData.key}/create`}
        component={FeatureDataWeatherCreate}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.featureData.key}/edit/:id`}
        component={FeatureDataWeatherEdit}
      />
      <Route
        exact
        path={`${slug.apiSharing.base}/${shareApiList.weather.featureData.key}/:id`}
        component={FeatureDataWeatherView}
      />
    </React.Fragment>
  )
})

const ApiSharingRoute = () => {
  return (
    <ApiSharingLayout>
      <Switch>
        <ApiSharing />
      </Switch>
    </ApiSharingLayout>
  )
}

export default ApiSharingRoute
