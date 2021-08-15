import slug from 'constants/slug'
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Import from './import'
import Search from './search'
import Station from './station'
import StationCreate from './station/StationCreate'
import StationEdit from './station/StationEdit'

export default function PeriodicalForecastRoute() {
  return (
    <Switch>
      <Route exact path={slug.periodicalForecast.station} component={Station} />
      <Route
        exact
        path={slug.periodicalForecast.stationCreate}
        component={StationCreate}
      />
      <Route
        exact
        path={`${slug.periodicalForecast.stationEdit}/:key`}
        component={StationEdit}
      />
      <Route exact path={slug.periodicalForecast.station} component={Station} />
      <Route path={slug.periodicalForecast.importStation} component={Import} />
      <Route path={slug.periodicalForecast.search} component={Search} />
    </Switch>
  )
}
