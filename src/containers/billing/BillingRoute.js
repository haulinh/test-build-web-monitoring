import slug from 'constants/slug'
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Config from './config'
import ConfigCreate from './config/ConfigCreate'
import ConfigEdit from './config/ConfigEdit'
import BillingReport from './report'

export default function BillingRoute() {
  return (
    <Switch>
      <Route exact path={slug.billing.config} component={Config} />
      <Route exact path={slug.billing.configCreate} component={ConfigCreate} />
      <Route
        exact
        path={`${slug.billing.configEdit}/:key`}
        component={ConfigEdit}
      />
      <Route exact path={slug.billing.report} component={BillingReport} />
    </Switch>
  )
}
