import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import MonitoringDevices from './general'

export default props => (
  <Switch>
    <Route
      exact
      path={slug.devicesManager.base}
      render={matchProps => <MonitoringDevices {...matchProps} {...props} />}
    />
  </Switch>
)
