import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import PageInfo from 'components/pageInfo'
import ReportType1 from './type1'

export default props => (
  <Switch>
    {/* <Route
      exact
      path={slug.report.type1}
      render={matchProps => <PageInfo {...matchProps} {...props} />}
    />   */}

    <Route
      exact
      path={slug.report.type1}
      render={matchProps => <ReportType1 {...matchProps} {...props} />}
    />
  </Switch>
)
