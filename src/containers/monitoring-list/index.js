import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import MonitoringGeneral from './general'

export default props => (
  <Switch>
    <Route
      exact
      path={slug.monitoringList.base}
      render={matchProps => <MonitoringGeneral {...matchProps} {...props} />}
    />
  </Switch>
)
