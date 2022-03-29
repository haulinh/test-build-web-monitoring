import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import StationFixedImportPoint from './import-multi-point'
import StationFixedCreate from './station-fixed-create'
import StationFixedEdit from './station-fixed-edit'
import StationFixedList from './station-fixed-list'
import StationFixedMap from './station-fixed-map'
import StationFixedMonitoringData from './station-fixed-monitoring-data'
import stationFixedDrive from './upload-file'
import StationFixedImportData from './station-fixed-import-data'
import StationFixedMonitoringDataDetail from './station-fixed-monitoring-data-detail'

export default props => (
  <Switch>
    <Route
      exact
      path={slug.stationFixed.list}
      render={matchProps => <StationFixedList {...matchProps} {...props} />}
    />
    <Route
      path={slug.stationFixed.create}
      // render={matchProps => <StationFixedCreate {...matchProps} {...props} />}
      component={StationFixedCreate}
    />
    <Route
      path={slug.stationFixed.edit}
      // render={matchProps => <StationFixedCreate {...matchProps} {...props} />}
      component={StationFixedEdit}
    />
    <Route
      path={slug.stationFixed.importPoint}
      component={StationFixedImportPoint}
    />
    <Route
      path={slug.stationFixed.importData}
      component={StationFixedImportData}
    />

    <Route
      path={slug.stationFixed.monitoringData}
      component={StationFixedMonitoringData}
    />
    <Route
      path={slug.stationFixed.monitoringDataDetail}
      component={StationFixedMonitoringDataDetail}
    />
    <Route path={slug.stationFixed.uploadFile} component={stationFixedDrive} />
    <Route path={slug.stationFixed.map} component={StationFixedMap} />
  </Switch>
)
