import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import FtpList from './ftp-list'
import FtpHistory from './ftp-tranfer-history'

export default props => (
  <Switch>
    <Route
      exact
      path={slug.ftpTransfer.list}
      render={matchProps => <FtpList {...matchProps} {...props} />}
    />
    <Route path={slug.ftpTransfer.history} component={FtpHistory} />
  </Switch>
)
