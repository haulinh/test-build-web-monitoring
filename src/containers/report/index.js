import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import PageInfo from 'components/pageInfo'
import ReportType1 from './type1'
import ReportType2 from './type2'
import ReportType3 from './type3'

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

    <Route
      path={slug.report.type2}
      render={matchProps => <ReportType2 {...matchProps} {...props} />}
    />

    <Route
      path={slug.report.type3}
      render={matchProps => <ReportType3 {...matchProps} {...props} />}
    />
  </Switch>
)
