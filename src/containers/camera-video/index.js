import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import CameraList from './camera-list'
import CameraDetail from './camera-detail'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.cameraControl.base}
      render={matchProps => <CameraList {...matchProps} {...props} />}
    />
    <Route path={slug.cameraControl.detail} component={CameraDetail} />
  </Switch>
)
