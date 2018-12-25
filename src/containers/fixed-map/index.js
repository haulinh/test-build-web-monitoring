import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import MapDefault from './map-default'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.mapFixed.base}
      render={matchProps => <MapDefault {...matchProps} {...props} />}
    />
  </Switch>
)
