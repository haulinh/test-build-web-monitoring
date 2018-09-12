import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import ProvinceList from './province-list'
import ProvinceCreate from './province-create'
import ProvinceEdit from './province-edit'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.province.list}
      render={matchProps => <ProvinceList {...matchProps} {...props} />}
    />
    <Route
      path={slug.province.create}
      render={matchProps => <ProvinceCreate {...matchProps} {...props} />}
    />
    <Route path={slug.province.edit} component={ProvinceEdit} />
  </Switch>
)
