import React, { Component } from "react";
import {Spin} from 'antd';
import createContentLoader from "hoc/content-loader";
import ListLoaderCp from "components/content-loader/list-loader";
import BoxLoaderCp from "components/content-loader/box-loader";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import SummaryList from "components/dashboard/summary/summary-list";
import HeaderView from "../../components/dashboard/header-view";
import ChartStatisticalRatio from "../../components/dashboard/chart/chart-statistical-ratio";
import ChartList from "components/dashboard/chart/chart-row-list";
import Clearfix from "components/elements/clearfix";
import { getStationTypes } from "api/CategoryApi";
import { getLastLog } from "api/StationAuto";
import { translate } from "hoc/create-lang";
import * as _ from "lodash";
import { STATUS_STATION, getStatusPriority } from "constants/stationStatus";
import WarningLevel from "components/elements/warning-level";

const GET_LAST_LOG_INTERVAL_TIME = 1000*60; // NOTE  every 1min will get last log
let getLastLogIntervalID = null;

const ListLoader = createContentLoader({
  component: <ListLoaderCp />,
  isAutoLoader: true,
  items: 5
})(null);

const BoxLoader = createContentLoader({
  component: <BoxLoaderCp />,
  isAutoLoader: true,
  items: 4,
  colSize: 3
})(null);

export default class OverviewDashboard extends Component {
  state = {
    stationStatus: "",
    stationTypeList: [],
    stationList: [],
    stationCount: {},
    stationNotUse: {},
    rows: {},
    lineSeries: {},
    isLoaded: false,
    province: null,
    groupLastLog: null,
    isGetLastLogLoading: false
  };

  getLastLog = async (province, provinceKey, rows, stationCount) => {
    this.setState({isGetLastLogLoading: true})

    let stationLastLog = await getLastLog();
    let dataLastLog = [];

    if (province && province.key) {
      provinceKey = province.key;
      dataLastLog = _.filter(
        _.get(stationLastLog, "data", []),
        item => _.get(item, "province.key", "") === provinceKey
      );
    } else {
      dataLastLog = _.get(stationLastLog, "data", []);
    }

    let groupLastLog = _.groupBy(dataLastLog, "stationType.key");
    _.forEach(_.keys(groupLastLog), key => {
      rows[key] = groupLastLog[key];
      stationCount[key] = _.size(rows[key]);
    });

    const goodCount = _.filter(dataLastLog, ({ status }) => status === "GOOD")
      .length;
    this.setState({
      province: provinceKey,
      stationList: dataLastLog,
      rows,
      stationCount,
      groupLastLog,
      stationStatus: translate("dashboard.activeStationPer", {
        good: goodCount,
        total: _.size(dataLastLog)
      }),
      isGetLastLogLoading: false
    });
  }

  getStationInfo = async province => {
    let provinceKey = null;
    let stationTypes = await getStationTypes({}, { isAuto: true });
    let stationTypeList = _.get(stationTypes, "data", []);

    let stationCount = {};
    let rows = {};
    let lineSeries = {};

    stationTypeList.forEach(({ key }) => {
      stationCount[key] = 0;
      rows[key] = [];
      lineSeries[key] = [];
    });

    this.setState({
      stationTypeList,
      stationCount,
      rows,
      lineSeries,
      isLoaded: true
    });

    // MARK  lấy last log 1 lần, sau đó cứ mỗi giây lại lấy last log
    this.getLastLog(province, provinceKey, rows, stationCount)
    if (getLastLogIntervalID) clearInterval(getLastLogIntervalID)
    getLastLogIntervalID = setInterval(
      () => {
        this.getLastLog(province, provinceKey, rows, stationCount)
        this.getSummaryList()
      }, 
      GET_LAST_LOG_INTERVAL_TIME
    );
  };

  async componentDidMount() {
    this.getStationInfo(null);
  }

  getSummaryList() {
    let arrayColor = [
      "#1dce6c",
      "#389bff",
      "#7ece23",
      "#e74c3c",
      "#1dce6c",
      "#389bff",
      "#7ece23",
      "#e74c3c"
    ];
    let arrayIcon = [
      "/images/dashboard/cloud.png",
      "/images/dashboard/groundwater.png",
      "/images/dashboard/surfaceWater.png",
      "/images/dashboard/wasteWater.png",
      "/images/dashboard/cloud.png",
      "/images/dashboard/groundwater.png",
      "/images/dashboard/surfaceWater.png",
      "/images/dashboard/wasteWater.png"
    ];

    return this.state.stationTypeList.map((item, index) => ({
      statusStation: this.timKiemStatusQuaLastLog(
        this.state.groupLastLog[item.key]
      ),
      color: item.color ? item.color : arrayColor[index], //arrayColor[index],
      name: item.name,
      key: item.key,
      image: item.icon ? item.icon : arrayIcon[index],
      number: this.state.stationCount[item.key],
      totalStationGood: this.state.rows[item.key].filter(
        ({ status }) => status === "GOOD"
      ).length
    }));
  }

  timKiemStatusQuaLastLog = (dataLog = []) => {
    let resStatus = STATUS_STATION.GOOD;

    const me = this;
    _.forEach(dataLog, function(item) {
      // MARK  check status trạm truớc
      if (item.status === STATUS_STATION.DATA_LOSS) {
        resStatus = item.status;
        return false; // break loop lodash
      }

      // MARK  check tới lastLog
      let statusMeasuring = me.timKiemStatusQuaMeasuringLog(
        item.lastLog.measuringLogs
      );
      resStatus = getStatusPriority(resStatus, statusMeasuring);
    });

    return resStatus;
  };

  timKiemStatusQuaMeasuringLog = (measuringLogs = {}) => {
    let resWarningLevel = null;
    _.forEach(measuringLogs, function(item, key) {
      resWarningLevel = getStatusPriority(resWarningLevel, item.warningLevel);
    });
    return resWarningLevel;
  };

  getChartList() {
    return _.map(this.state.stationTypeList, item => ({
      key: item.key,
      title: item.name,
      totalStation: this.state.stationCount[item.key],
      stationList: this.state.rows[item.key]
    }));
  }

  handleProvinceChange = province => {
    this.setState({ province });
    this.getStationInfo(province);
  };

  render() {
    return (
      <PageContainer
        isLoading={!this.state.isLoaded}
        backgroundColor="#fafbfb"
        componentLoading={
          <div>
            <BoxLoader />
            <Clearfix height={24} />
            <ListLoader />
          </div>
        }
        hideTitle
      >
        <HeaderView
          stationStatus={this.state.stationStatus}
          onChange={this.handleProvinceChange}
        />
        {this.state.groupLastLog && (
          <Spin spinning={this.state.isGetLastLogLoading}>
            <SummaryList data={this.getSummaryList()} />
          </Spin>
        )}
        <div
          style={{
            width: "50%",
            marginLeft: "50%",
            padding: 4,
            paddingRight: 0
          }}
        >
          <WarningLevel />
        </div>

        <ChartStatisticalRatio
          loading={this.state.isGetLastLogLoading}
          data={this.state.stationList}
          province={this.state.province}
        />
        {/* this.state.stationList */}
        <ChartList data={this.getChartList()} />
      </PageContainer>
    );
  }
}
