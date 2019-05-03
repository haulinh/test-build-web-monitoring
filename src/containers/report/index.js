import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import PageInfo from 'components/pageInfo'

export default props => (
  <Switch>
    <Route
      exact
      path={slug.report.base}
      render={matchProps => <PageInfo {...matchProps} {...props} />}
    />
  
  </Switch>
)
