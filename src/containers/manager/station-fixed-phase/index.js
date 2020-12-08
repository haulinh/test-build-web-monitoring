import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import StationFixedPhaseList from './station-fixed-phase-list'
import StationFixedPhaseCreate from './station-fixed-phase-create'
import StationFixedPhaseEdit from './station-fixed-phase-edit'
// Khởi tạo danh sách route dành cho measuring

export default props => (
  <Switch>
    <Route
      exact
      path={slug.stationFixedPhase.list}
      render={matchProps => <StationFixedPhaseList {...matchProps} {...props} />}
    />
    <Route
      path={slug.stationFixedPhase.create}
      render={matchProps => <StationFixedPhaseCreate {...matchProps} {...props} />}
      
    />
    <Route path={slug.stationFixedPhase.edit} component={StationFixedPhaseEdit} />
    {/*<Route path={slug.measuring.create} component={MeasuringCreate} />*/}
  </Switch>
)
