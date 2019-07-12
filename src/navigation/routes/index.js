import React from "react";
import { Route, Switch } from "react-router-dom";
import { autobind } from "core-decorators";
import slug from "constants/slug";
import OverviewDashboard from "containers/dashboard/OverviewDashboard";
import LoginRoute from "./loginRoute";
import LayoutRoute from "layout/default-sidebar-layout/routeCombine";

import MeasuringRoute from "containers/manager/measuring";
import StationAutoRoute from "containers/manager/station-auto";
import StationFixedRoute from "containers/manager/station-fixed";
import StationTypeRoute from "containers/manager/station-type";
import ProvinceRoute from "containers/manager/province";
import QCVNRoute from "containers/manager/qcvn";
import OnlineMonitoring from "containers/online-monitoring";
import Map from "containers/map";
import DataSearch from "containers/search/data-search";
import AvgSearch from "containers/search/avg-search";
import DataSearchFixed from "containers/search/data-search-fixed";

import Monitoring from "containers/monitoring";
import EmailConfirm from "containers/auth/reset-password/email-confirm";
import CodeConfirm from "containers/auth/reset-password/code-confirm";
import ResetPassword from "containers/auth/reset-password";
import UserRoute from "containers/user";
import SubscriptionRoute from "containers/subscription";
import RoleRoute from "containers/role";
import ControlStation from "containers/control-station";
import Camera from "containers/camera";
import AccountActive from "containers/auth/account-active";
import CameraControl from "containers/camera-video";
import SupportRoute from "containers/support";
import AqiContainer from "containers/aqi";
import WqiContainer from "containers/wqi";
import QaQcContainer from "containers/qa-qc/approved-data";
import PublishConfigContainer from "containers/qa-qc/approved-data/config-publish";
import QaQcConfig from "containers/qa-qc/config";
import FtpTransferRoute from "containers/manager/config-ftp-transfer";
import ConfigWQIRoute from "containers/manager/config-wqi";
import MapFixedContainer from "containers/fixed-map";
import ExceededContainer from "containers/statistic/exceeded";
import PercentReceivedData from "containers/statistic/per-rec-data";
import AqiStatistic from "containers/statistic/aqi";
import WqiStatistic from "containers/statistic/wqi";
import Layout from "layout/default-sidebar-layout";
import Report from "containers/report";

@autobind
export default class RouteDefault extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path={slug.login} component={LoginRoute} />
          <Route path={slug.password.emailConfirm} component={EmailConfirm} />
          <Route path={slug.password.codeConfirm} component={CodeConfirm} />
          <Route path={slug.password.resetPassword} component={ResetPassword} />
          <Route path={slug.user.accountActive} component={AccountActive} />

          <Layout>
            <LayoutRoute path="/" exact component={OverviewDashboard} />
            <LayoutRoute path={slug.map.base} exact component={Map} />
            <LayoutRoute path={slug.measuring.base} component={MeasuringRoute} />
            <LayoutRoute path={slug.aqi.base} component={AqiContainer} />
            <LayoutRoute path={slug.wqi.base} component={WqiContainer} />
            <LayoutRoute path={slug.stationAuto.base} component={StationAutoRoute} />
            <LayoutRoute path={slug.stationFixed.base} component={StationFixedRoute} />
            <LayoutRoute path={slug.configWQI.base} component={ConfigWQIRoute} />
            <LayoutRoute path={slug.stationType.base} component={StationTypeRoute} />
            <LayoutRoute path={slug.province.base} component={ProvinceRoute} />
            <LayoutRoute path={slug.qcvn.base} component={QCVNRoute} />
            <LayoutRoute path={slug.ftpTransfer.base} component={FtpTransferRoute} />
            <LayoutRoute path={slug.onlineMonitoring.base} component={OnlineMonitoring} />
            <LayoutRoute path={slug.monitoring.base} component={Monitoring} />
            <LayoutRoute path={slug.dataSearch.base} component={DataSearch} />
            <LayoutRoute path={slug.avgSearch.base} component={AvgSearch} />
            <LayoutRoute path={slug.dataSearchFixed.base} component={DataSearchFixed} />
            <LayoutRoute path={slug.mapFixed.base} component={MapFixedContainer} />
            <LayoutRoute path={slug.statistic.aqi} component={AqiStatistic} />
            <LayoutRoute path={slug.statistic.wqi} component={WqiStatistic} />
            <LayoutRoute path={slug.statistic.exceeded} component={ExceededContainer} />
            <LayoutRoute path={slug.statistic.perRecData} component={PercentReceivedData} />

            <LayoutRoute path={slug.qaqc.base} component={QaQcContainer} />
            <LayoutRoute path={slug.qaqc.config} component={PublishConfigContainer} />
            <LayoutRoute path={slug.qaqc.configNew} component={QaQcConfig} />

            <LayoutRoute path={slug.user.base} component={UserRoute} />
            <LayoutRoute path={slug.role.base} component={RoleRoute} />
            <LayoutRoute path={slug.subscription.base} component={SubscriptionRoute} />

            <LayoutRoute path={slug.controlStation.base} component={ControlStation} />
            <LayoutRoute path={slug.camera.base} component={Camera} />
            <LayoutRoute path={slug.cameraControl.base} component={CameraControl} />
            <LayoutRoute path={slug.support.base} component={SupportRoute} />
            <LayoutRoute path={slug.report.base} component={Report} />
          </Layout>
        </Switch>
      </div>
    );
  }
}
