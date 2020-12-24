import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import StationFixedList from './station-fixed-list'
import StationFixedCreate from './station-fixed-create'
import StationFixedImportData from './station-fixed-import-data'
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
      path={slug.stationFixed.importData}
      component={StationFixedImportData}
    />
    <Route
      path={slug.stationFixed.map}
      component={StationFixedMap}
    />
  </Switch>
)
