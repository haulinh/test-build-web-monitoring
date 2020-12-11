import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { StationFixedReport } from './station-fixed-report'
// Route Station Fixed Report

export default props => (
  <Switch>
    <Route
      exact
      path={slug.stationFixedReport.base}
      render={matchProps => <StationFixedReport {...matchProps} {...props} />}
    />
  </Switch>
)
