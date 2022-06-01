import slug from 'constants/slug'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AlarmSetting from './AlarmSetting'
import AlarmHistory from './history'
import AlarmManagement from './management'

export default function AlarmRoute() {
  return (
    <Switch>
      <Route path={slug.alarm.management} component={AlarmManagement} />
      <Route exact path={slug.alarm.history} component={AlarmHistory} />
      <Route exact path={slug.alarm.setting} component={AlarmSetting} />
    </Switch>
  )
}
