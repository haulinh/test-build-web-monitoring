import React, { lazy, Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getConfigApi } from 'config'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
// import AqiStatistic from "containers/statistic/aqi";
// import WqiStatistic from "containers/statistic/wqi";
import Layout from 'layout/default-sidebar-layout'
import LayoutRoute from 'layout/default-sidebar-layout/routeCombine'

import advanceRoute from './advanceRoute'
import LoginRoute from './loginRoute'
import ErrorBoundary from './ErrorBoundary'

const APISharing = lazy(() => import('containers/api-sharing-hidden'))
const ApiSharingRoute = lazy(() =>
  import('containers/api-sharing/ApiSharingRoute')
)
const AppGrafana = lazy(() => import('containers/apps/grafana'))
const AppIncidents = lazy(() => import('containers/apps/incidents'))
const AccountActive = lazy(() => import('containers/auth/account-active'))
const Camera = lazy(() => import('containers/camera'))
const CameraControl = lazy(() => import('containers/camera-video'))
const ConfigService = lazy(() => import('containers/config-service'))
const ControlStation = lazy(() => import('containers/control-station'))
const OverviewDashboard = lazy(() => import('containers/dashboard'))
const DashboardDetail = lazy(() => import('containers/dashboard-detail'))
const DataAnalytics = lazy(() => import('containers/data-analytics'))
const DataLoggerPage = lazy(() => import('containers/data-logger'))
const MapFixedContainer = lazy(() => import('containers/fixed-map'))
// import PageAqiStatus from 'containers/aqi/aqi-list-status'
const PageExpLicenseInfo = lazy(() =>
  import('containers/license/exp-license-info')
)
const FtpTransferRoute = lazy(() =>
  import('containers/manager/config-ftp-transfer')
)
const ConfigLanguagePage = lazy(() =>
  import('containers/manager/config-language')
)
const MeasuringRoute = lazy(() => import('containers/manager/measuring'))
const ProvinceRoute = lazy(() => import('containers/manager/province'))
const QCVNRoute = lazy(() => import('containers/manager/qcvn'))
const StationAutoRoute = lazy(() => import('containers/manager/station-auto'))
const StationFixedRoute = lazy(() => import('containers/manager/station-fixed'))
const StationFixedPhaseRoute = lazy(() =>
  import('containers/manager/station-fixed-phase')
)
const StationFixedReport = lazy(() =>
  import('containers/manager/station-fixed-report/station-fixed-report')
)
const StationTypeRoute = lazy(() => import('containers/manager/station-type'))
const Map = lazy(() => import('containers/map'))
const Monitoring = lazy(() => import('containers/monitoring'))
const MonitoringList = lazy(() => import('containers/monitoring-list'))
const OnlineMonitoring = lazy(() => import('containers/online-monitoring'))
const PeriodicalForecastRoute = lazy(() =>
  import('containers/periodical-forecast/PeriodicalForecastRoute')
)
const QaQcContainer = lazy(() => import('containers/qa-qc/approved-data'))
const PublishConfigContainer = lazy(() =>
  import('containers/qa-qc/approved-data/config-publish')
)
const QaQcConfig = lazy(() => import('containers/qa-qc/config'))
const Report = lazy(() => import('containers/report'))
const RoleRoute = lazy(() => import('containers/role'))
const AvgSearch = lazy(() => import('containers/search/avg-search'))
const AvgSearchAdvanced = lazy(() =>
  import('containers/search/avg-search-advanced')
)
const DataSearch = lazy(() => import('containers/search/data-search'))
const DataSearchFixed = lazy(() =>
  import('containers/search/data-search-fixed')
)
const ExceededContainer = lazy(() => import('containers/statistic/exceeded'))
const PercentReceivedData = lazy(() =>
  import('containers/statistic/per-rec-data')
)
const SubscriptionRoute = lazy(() => import('containers/subscription'))
const SupportRoute = lazy(() => import('containers/support'))
const UserRoute = lazy(() => import('containers/user'))

const TicketRoute = lazy(() => import('containers/ticket/TicketRoute'))
const BillingRoute = lazy(() => import('containers/billing/BillingRoute'))
const AlarmRoute = lazy(() => import('containers/alarm/AlarmRoute'))

class LoadingNProgress extends React.Component {
  componentDidMount() {
    NProgress.start()
  }
  componentWillUnmount() {
    NProgress.done()
  }

  render() {
    return <React.Fragment />
  }
}

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
            <Suspense fallback={<LoadingNProgress />}>
              <ErrorBoundary>
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
                <LayoutRoute
                  path={slug.province.base}
                  component={ProvinceRoute}
                />
                <LayoutRoute path={slug.qcvn.base} component={QCVNRoute} />
                <LayoutRoute
                  path={slug.ftpTransfer.base}
                  component={FtpTransferRoute}
                />
                <LayoutRoute
                  path={slug.apiSharing.base}
                  component={ApiSharingRoute}
                />
                <LayoutRoute
                  path="/api-sharing-hidden"
                  component={APISharing}
                />
                <LayoutRoute
                  path={slug.onlineMonitoring.base}
                  component={OnlineMonitoring}
                />
                <LayoutRoute
                  path={slug.monitoring.base}
                  component={Monitoring}
                />
                <LayoutRoute
                  path={slug.monitoringList.base}
                  component={MonitoringList}
                />
                <LayoutRoute
                  path={slug.dataSearch.base}
                  component={DataSearch}
                />
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
                <LayoutRoute
                  path={slug.qaqc.configNew}
                  component={QaQcConfig}
                />

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
                <LayoutRoute
                  path={slug.support.base}
                  component={SupportRoute}
                />

                <LayoutRoute path={slug.report.base} component={Report} />
                <LayoutRoute
                  path={slug.advance.base}
                  component={advanceRoute}
                />

                {/* NOTE Nhật ký */}
                <LayoutRoute
                  path={slug.dataLogger.base}
                  component={DataLoggerPage}
                />
                <LayoutRoute
                  path={slug.language.base}
                  component={ConfigLanguagePage}
                />

                <LayoutRoute
                  path={slug.config.service}
                  component={ConfigService}
                />
                <LayoutRoute
                  path={slug.periodicalForecast.base}
                  component={PeriodicalForecastRoute}
                />

                <LayoutRoute
                  path={slug.billing.base}
                  component={BillingRoute}
                />
                <LayoutRoute path={slug.ticket.base} component={TicketRoute} />
                <LayoutRoute path={slug.alarm.base} component={AlarmRoute} />
              </ErrorBoundary>
            </Suspense>
          </Layout>
        </Switch>
      </div>
    )
  }
}
