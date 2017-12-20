import React from 'react'
import { Route } from 'react-router-dom'
import { autobind } from 'core-decorators'
import slug from 'constants/slug'

import ManagerRoute from './managerRoute'
import MapRoute from './mapRoute'
import LoginRoute from './loginRoute'

@autobind
export default class RouteDefault extends React.Component {
  render() {
    return (
      <div>
        <Route path="/" exact component={ManagerRoute} />      
        <Route path={slug.login} exact component={LoginRoute} />      
        <Route path={slug.map.base} exact component={MapRoute} />
      </div>
    )
  }
}

//
