import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import MapDefault from './map-default'
import AqiContainer from 'containers/aqi'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.map.base}
      render={matchProps => <MapDefault {...matchProps} {...props} />}
    />
    <Route
      path={slug.map.aqi}
      render={matchProps => <AqiContainer {...matchProps} {...props} />}
    />
  </Switch>
)
