import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import PageInfo from 'components/pageInfo'
import ReportType1 from './type1'
import ReportType2 from './type2'
import ReportType3 from './type3'
import ReportType4 from './type4'
import ReportType5 from './type5'
import ReportType6 from './type6'
import ReportType7 from './type7'

export default props => (
  <Switch>
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

    <Route
      path={slug.report.type4}
      render={matchProps => <ReportType4 {...matchProps} {...props} />}
    />

    <Route
      path={slug.report.type5}
      render={matchProps => <ReportType5 {...matchProps} {...props} />}
    />

    <Route
      path={slug.report.type6}
      render={matchProps => <ReportType6 {...matchProps} {...props} />}
    />

    <Route
      path={slug.report.type7}
      render={matchProps => <ReportType7 {...matchProps} {...props} />}
    />
  </Switch>
)
