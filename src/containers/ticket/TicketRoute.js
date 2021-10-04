import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ConfigProperties from './ConfigProperties'
import IncidentManagement from './IncidentManagement'
import IncidentDetail from './IncidentManagement/IncidentDetail'

export default function TicketRoute() {
  return (
    <Switch>
      <Route exact path={slug.ticket.base} component={IncidentManagement} />
      <Route exact path={slug.ticket.incident} component={IncidentManagement} />
      <Route
        exact
        path={`${slug.ticket.incidentEdit}/:id`}
        component={IncidentDetail}
      />
      <Route
        exact
        path={slug.ticket.configProperties}
        component={ConfigProperties}
      />
    </Switch>
  )
}
