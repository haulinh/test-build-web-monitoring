import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import QCVNList from './qcvn-list'
import QCVNCreate from './qcvn-create'
import QCVNEdit from './qcvn-edit'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.qcvn.list}
      render={matchProps => <QCVNList {...matchProps} {...props} />}
    />
    <Route
      path={slug.qcvn.create}
      render={matchProps => <QCVNCreate {...matchProps} {...props} />}
    />
    <Route path={slug.qcvn.edit} component={QCVNEdit} />
    {/*<Route path={slug.measuring.create} component={MeasuringCreate} />*/}
  </Switch>
)
