import { getConfigApi } from 'config'
import slug from 'constants/slug'
import AppGrafana from 'containers/apps/grafana'
import AppIncidents from 'containers/apps/incidents'
import AccountActive from 'containers/auth/account-active'
import Camera from 'containers/camera'
import CameraControl from 'containers/camera-video'
import ConfigService from 'containers/config-service'
import ControlStation from 'containers/control-station'
import OverviewDashboard from 'containers/dashboard'
import DashboardDetail from 'containers/dashboard-detail'
import DataLoggerPage from 'containers/data-logger'
import MapFixedContainer from 'containers/fixed-map'
// import PageAqiStatus from 'containers/aqi/aqi-list-status'
import PageExpLicenseInfo from 'containers/license/exp-license-info'
import FtpTransferRoute from 'containers/manager/config-ftp-transfer'
import MeasuringRoute from 'containers/manager/measuring'
import ProvinceRoute from 'containers/manager/province'
import QCVNRoute from 'containers/manager/qcvn'
import StationAutoRoute from 'containers/manager/station-auto'
import StationFixedRoute from 'containers/manager/station-fixed'
import StationFixedPhaseRoute from 'containers/manager/station-fixed-phase'
import { StationFixedReport } from 'containers/manager/station-fixed-report/station-fixed-report'
import StationTypeRoute from 'containers/manager/station-type'
import Map from 'containers/map'
import Monitoring from 'containers/monitoring'
import MonitoringList from 'containers/monitoring-list'
import OnlineMonitoring from 'containers/online-monitoring'
import QaQcContainer from 'containers/qa-qc/approved-data'
import PublishConfigContainer from 'containers/qa-qc/approved-data/config-publish'
import QaQcConfig from 'containers/qa-qc/config'
import Report from 'containers/report'
import RoleRoute from 'containers/role'
import AvgSearch from 'containers/search/avg-search'
import AvgSearchAdvanced from 'containers/search/avg-search-advanced'
import DataSearch from 'containers/search/data-search'
import DataSearchFixed from 'containers/search/data-search-fixed'
import ExceededContainer from 'containers/statistic/exceeded'
import PercentReceivedData from 'containers/statistic/per-rec-data'
import SubscriptionRoute from 'containers/subscription'
import SupportRoute from 'containers/support'
import UserRoute from 'containers/user'
import DataAnalytics from 'containers/data-analytics'
import { autobind } from 'core-decorators'
// import AqiStatistic from "containers/statistic/aqi";
// import WqiStatistic from "containers/statistic/wqi";
import Layout from 'layout/default-sidebar-layout'
import LayoutRoute from 'layout/default-sidebar-layout/routeCombine'
import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import advanceRoute from './advanceRoute'
import LoginRoute from './loginRoute'
import ApiSharingRoute from 'containers/api-sharing/ApiSharingRoute'
import APISharing from 'containers/api-sharing-hidden'
import PeriodicalForecastRoute from 'containers/periodical-forecast/PeriodicalForecastRoute'
import BillingRoute from 'containers/billing/BillingRoute'
import TicketRoute from 'containers/ticket/TicketRoute'

@withRouter
@autobind
export default class RouteDefault extends React.Component {
  componentDidMount() {
    const pathname = this.props.location.pathname
    const defaultPage = getConfigApi().defaultPage
    // console.log(defaultPage, '--defaultPage')
    if (pathname === '/' && defaultPage) {
      this.props.history.push(defaultPage)
    }
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path={slug.login.loginWithEmail} component={LoginRoute} />
          <Route
            path={slug.login.loginWithPhoneNumber}
            component={LoginRoute}
          />
          <Route path={slug.password.emailConfirm} component={LoginRoute} />
          <Route path={slug.password.resetPassword} component={LoginRoute} />
          <Route path={slug.user.accountActive} component={AccountActive} />
          <Route path={slug.user.expLicense} component={PageExpLicenseInfo} />

          <Route path={slug.apps.incidents} component={AppIncidents} />
          <Route path={slug.apps.grafana} component={AppGrafana} />

          <Layout isShowSidebarMenu>
            <LayoutRoute
              path={slug.dashboard.healthCheck}
              exact
              component={OverviewDashboard}
            />
            <LayoutRoute
              path={slug.dashboard.overview}
              exact
              component={DashboardDetail}
            />
            <LayoutRoute path={slug.map.base} component={Map} />

            <LayoutRoute
              path={slug.measuring.base}
              component={MeasuringRoute}
            />

            <LayoutRoute
              path={slug.stationAuto.base}
              component={StationAutoRoute}
            />
            <LayoutRoute
              path={slug.stationFixed.base}
              component={StationFixedRoute}
            />
            <LayoutRoute
              path={slug.stationFixedPhase.base}
              component={StationFixedPhaseRoute}
            />

            <LayoutRoute
              path={slug.stationFixedReport.base}
              component={StationFixedReport}
            />

            <LayoutRoute
              path={slug.stationType.base}
              component={StationTypeRoute}
            />
            <LayoutRoute path={slug.province.base} component={ProvinceRoute} />
            <LayoutRoute path={slug.qcvn.base} component={QCVNRoute} />
            <LayoutRoute
              path={slug.ftpTransfer.base}
              component={FtpTransferRoute}
            />
            <LayoutRoute
              path={slug.apiSharing.base}
              component={ApiSharingRoute}
            />
            <LayoutRoute path="/api-sharing-hidden" component={APISharing} />
            <LayoutRoute
              path={slug.onlineMonitoring.base}
              component={OnlineMonitoring}
            />
            <LayoutRoute path={slug.monitoring.base} component={Monitoring} />
            <LayoutRoute
              path={slug.monitoringList.base}
              component={MonitoringList}
            />
            <LayoutRoute path={slug.dataSearch.base} component={DataSearch} />
            <LayoutRoute
              path={slug.avgSearchAdvanced.base}
              component={AvgSearchAdvanced}
            />
            <LayoutRoute path={slug.avgSearch.base} component={AvgSearch} />
            <LayoutRoute
              path={slug.dataSearchFixed.base}
              component={DataSearchFixed}
            />
            <LayoutRoute
              path={slug.mapFixed.base}
              component={MapFixedContainer}
            />
            {/* <LayoutRoute path={slug.statistic.aqi} component={AqiStatistic} />
            <LayoutRoute path={slug.statistic.wqi} component={WqiStatistic} /> */}
            <LayoutRoute
              path={slug.statistic.exceeded}
              component={ExceededContainer}
            />
            <LayoutRoute
              path={slug.statistic.perRecData}
              component={PercentReceivedData}
            />

            <LayoutRoute path={slug.qaqc.base} component={QaQcContainer} />
            <LayoutRoute
              path={slug.qaqc.config}
              component={PublishConfigContainer}
            />
            <LayoutRoute path={slug.qaqc.configNew} component={QaQcConfig} />

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
            <LayoutRoute path={slug.camera.base} component={Camera} />
            <LayoutRoute
              path={slug.dataAnalytics.base}
              component={DataAnalytics}
            />
            <LayoutRoute
              path={slug.cameraControl.base}
              component={CameraControl}
            />
            <LayoutRoute path={slug.support.base} component={SupportRoute} />

            <LayoutRoute path={slug.report.base} component={Report} />
            <LayoutRoute path={slug.advance.base} component={advanceRoute} />

            {/* NOTE Nhật ký */}
            <LayoutRoute
              path={slug.dataLogger.base}
              component={DataLoggerPage}
            />

            <LayoutRoute path={slug.config.service} component={ConfigService} />
            <LayoutRoute
              path={slug.periodicalForecast.base}
              component={PeriodicalForecastRoute}
            />
            <LayoutRoute path={slug.billing.base} component={BillingRoute} />
            <LayoutRoute path={slug.ticket.base} component={TicketRoute} />
          </Layout>
        </Switch>
      </div>
    )
  }
}
