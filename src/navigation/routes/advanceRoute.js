import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import AqiContainer from 'containers/aqi'
import ReportAQI from 'containers/statistic/aqi'
import ReportAQIDay from 'containers/statistic/aqi-day'
import ReportWQI from 'containers/statistic/wqi'
import ReportWQIDay from 'containers/statistic/wqi-day'
import WqiContainer from 'containers/wqi'
import ConfigWQIRoute from 'containers/manager/config-wqi'
import AqiConfigCalculationContainer from 'containers/aqi/configCalculation'
import AqiListConfigContainer from 'containers/aqi/listConfig'
import PageAqiStatus from 'containers/aqi/aqi-list-status'
import WqiListConfigContainer from 'containers/wqi/listConfig'
import WqiConfigCalculationContainer from 'containers/wqi/configCalculation'
import WQIStationFixed from 'containers/statistic/wqi-station-fixed'

export default props => (
  <Switch>
    <Route
      path={slug.advance.mapAqi}
      render={matchProps => <AqiContainer {...matchProps} {...props} />}
    />
    <Route
      path={slug.advance.aqi_hour}
      render={matchProps => <ReportAQI {...matchProps} {...props} />}
    />
    <Route
      path={slug.advance.aqi_day}
      render={matchProps => <ReportAQIDay {...matchProps} {...props} />}
    />
    <Route path={slug.advance.mapWqi} component={WqiContainer} />

    <Route
      path={slug.advance.wqi_hour}
      render={matchProps => <ReportWQI {...matchProps} {...props} />}
    />
    <Route
      path={slug.advance.wqi_day}
      render={matchProps => <ReportWQIDay {...matchProps} {...props} />}
    />
    <Route
      path={slug.advance.wqi_periodic}
      render={matchProps => <WQIStationFixed {...matchProps} {...props} />}
    />
    <Route
      path={slug.advance.mapWqi}
      render={matchProps => <WqiContainer {...matchProps} {...props} />}
    />
    <Route path={slug.advance.enableAqiWqi} component={ConfigWQIRoute} />
    <Route
      exact
      path={slug.advance.configAqi}
      // component={AqiConfigCalculationContainer}
      component={AqiListConfigContainer}
    />
    <Route
      path={slug.advance.configAqiEdit}
      component={AqiConfigCalculationContainer}
    />
    <Route exact path={slug.advance.status} component={PageAqiStatus} />
    <Route
      exact
      path={slug.advance.configWqi}
      component={WqiListConfigContainer}
    />
    <Route
      path={slug.advance.configEditWqi}
      component={WqiConfigCalculationContainer}
    />
  </Switch>
)
