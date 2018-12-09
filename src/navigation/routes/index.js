import React from 'react'
import { Route } from 'react-router-dom'
import { autobind } from 'core-decorators'
import slug from 'constants/slug'
import OverviewDashboard from 'containers/dashboard/OverviewDashboard'
import LoginRoute from './loginRoute'
import LayoutRoute from 'layout/default-sidebar-layout/routeCombine'

import MeasuringRoute from 'containers/manager/measuring'
import StationAutoRoute from 'containers/manager/station-auto'
import StationTypeRoute from 'containers/manager/station-type'
import ProvinceRoute from 'containers/manager/province'
import QCVNRoute from 'containers/manager/qcvn'
import OnlineMonitoring from 'containers/online-monitoring'
import Map from 'containers/map'
import DataSearch from 'containers/search/data-search'
import AvgSearch from 'containers/search/avg-search'
import Monitoring from 'containers/monitoring'
import EmailConfirm from 'containers/auth/reset-password/email-confirm'
import CodeConfirm from 'containers/auth/reset-password/code-confirm'
import ResetPassword from 'containers/auth/reset-password'
import UserRoute from 'containers/user'
import SubscriptionRoute from 'containers/subscription'
import RoleRoute from 'containers/role'
import ControlStation from 'containers/control-station'
import Camera from 'containers/camera'
import AccountActive from 'containers/auth/account-active'
import CameraControl from 'containers/camera-control'
import SupportRoute from 'containers/support'
import AqiContainer from 'containers/aqi'
import WqiContainer from 'containers/wqi'
import QaQcContainer from 'containers/qa-qc'
import PublishConfigContainer from 'containers/qa-qc/config-publish'
import FtpTransferRoute from 'containers/manager/config-ftp-transfer'

@autobind
export default class RouteDefault extends React.Component {
  render() {
    return (
      <div>
        <LayoutRoute path="/" exact component={OverviewDashboard} />
        <LayoutRoute path={slug.map.base} exact component={Map} />
        <LayoutRoute path={slug.measuring.base} component={MeasuringRoute} />
        <LayoutRoute path={slug.aqi.base} component={AqiContainer} />
        <LayoutRoute path={slug.wqi.base} component={WqiContainer} />
        <LayoutRoute
          path={slug.stationAuto.base}
          component={StationAutoRoute}
        />
        <LayoutRoute
          path={slug.stationType.base}
          component={StationTypeRoute}
        />
        <LayoutRoute path={slug.province.base} component={ProvinceRoute} />
        <LayoutRoute path={slug.qcvn.base} component={QCVNRoute} />
        <LayoutRoute path={slug.ftpTransfer.base} component={FtpTransferRoute} />
        <LayoutRoute
          path={slug.onlineMonitoring.base}
          component={OnlineMonitoring}
        />
        <LayoutRoute path={slug.monitoring.base} component={Monitoring} />
        <LayoutRoute path={slug.dataSearch.base} component={DataSearch} />
        <LayoutRoute path={slug.avgSearch.base} component={AvgSearch} />
        <LayoutRoute path={slug.qaqc.base} component={QaQcContainer} />
        <LayoutRoute
          path={slug.qaqc.config}
          component={PublishConfigContainer}
        />
        <Route path={slug.login} component={LoginRoute} />
        <LayoutRoute path={slug.user.base} component={UserRoute} />
        <LayoutRoute path={slug.role.base} component={RoleRoute} />
        <LayoutRoute
          path={slug.subscription.base}
          component={SubscriptionRoute}
        />

        <LayoutRoute
          path={slug.controlStation.base}
          component={ControlStation}
        />
        <Route path={slug.password.emailConfirm} component={EmailConfirm} />
        <Route path={slug.password.codeConfirm} component={CodeConfirm} />
        <Route path={slug.password.resetPassword} component={ResetPassword} />
        <LayoutRoute path={slug.camera.base} component={Camera} />
        <Route path={slug.user.accountActive} component={AccountActive} />
        <LayoutRoute path={slug.cameraControl.base} component={CameraControl} />
        <LayoutRoute path={slug.support.base} component={SupportRoute} />
      </div>
    )
  }
}
