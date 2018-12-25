import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import StationFixedList from './station-fixed-list'
import StationFixedCreate from './station-fixed-create'
import StationFixedEdit from './station-fixed-edit'
import StationFixedRange from './station-fixed-range'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.stationFixed.list}
      render={matchProps => <StationFixedList {...matchProps} {...props} />}
    />
    <Route
      path={slug.stationFixed.create}
      render={matchProps => <StationFixedCreate {...matchProps} {...props} />}
    />
    <Route path={slug.stationFixed.edit} component={StationFixedEdit} />
    <Route path={slug.stationFixed.range} component={StationFixedRange} />
    {/*<Route path={slug.stationAuto.create} component={StationAutoCreate} />*/}
  </Switch>
)
