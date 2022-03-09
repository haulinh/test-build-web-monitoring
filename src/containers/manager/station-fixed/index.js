import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import StationFixedList from './station-fixed-list'
import StationFixedCreate from './station-fixed-create'
import StationFixedImportData from './station-fixed-import-data'
import StationFixedMonitoringData from './station-fixed-monitoring-data'
import stationFixedDrive from './upload-file'
import StationFixedImportPoint from './import-multi-point'
import StationFixedEdit from './station-fixed-edit'
import StationFixedMap from './station-fixed-map'

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
      path={slug.stationFixed.monitoringData}
      component={StationFixedMonitoringData}
    />
    <Route path={slug.stationFixed.uploadFile} component={stationFixedDrive} />
    <Route path={slug.stationFixed.map} component={StationFixedMap} />
  </Switch>
)
