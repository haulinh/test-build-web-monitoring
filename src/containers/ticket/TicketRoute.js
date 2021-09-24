import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ConfigProperties from './ConfigProperties'
import DataLookup from './DataLookup'
import IncidentManagement from './IncidentManagement'

export default function TicketRoute() {
  return (
    <Switch>
      <Route exact path={slug.ticket.incident} component={IncidentManagement} />
      <Route exact path={slug.ticket.dataLookup} component={DataLookup} />
      <Route
        exact
        path={slug.ticket.configProperties}
        component={ConfigProperties}
      />
    </Switch>
  )
}