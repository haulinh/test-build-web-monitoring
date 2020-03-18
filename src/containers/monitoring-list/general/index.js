import React from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { autobind } from "core-decorators";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import StationAutoApi from "api/StationAuto";
import CategoriesApi from "api/CategoryApi";
import Header from "components/monitoring-list/head";
import HeaderFilter from "components/monitoring-list/filter";
import StationTypeList from "components/monitoring-list/station-type-group/station-type-list";
import monitoringFilter from "constants/monitoringFilter";
import ListLoaderCp from "components/content-loader/list-loader";
import Clearfix from "components/elements/clearfix";
import { getMonitoringFilter, setMonitoringFilter } from "utils/localStorage";
import { replaceVietnameseStr } from "utils/string";
import * as _ from "lodash";
import HeaderView from "../../../components/monitoring-list/header-view";
import styled from "styled-components";
import {
  GROUP_OPTIONS,
  ORDER_OPTIONS
} from "components/monitoring/filter/options";
import createContentLoader from "hoc/content-loader";
import { translate } from "hoc/create-lang";
import ROLE from "constants/role";
import protectRole from "hoc/protect-role";
import { connect } from "react-redux";
import { changeOpenSubMenu } from "redux/actions/themeAction";
import { Tag } from "antd";

const ContainerHeader = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  padding: 0px 8px;
  background-color: #ffffff;
  border-radius: 4px;
  border: solid 0.4px #b6b6b6;
  box-shadow: 0 4px 10px 0 rgba(241, 241, 241, 0.5);
`;

const HeaderDesc = styled.div`
  display: flex;
  line-height: 3;
  justify-content: space-between;
  .left {
    display: flex;
  }
  .right {
    display: flex;
  }
  .ant-tag {
    min-width: 90px;
    text-align: center;
    font-weight: 600;
    font-size: 11px;
    line-height: 22px;
    &.data-loss {
      color: rgba(0, 0, 0, 0.45);
    }
    &.data-exceed {
      color: #f5222d;
    }
    &.data-extend-prepare {
      color: #faad14;
    }
    &.data-good {
      color: #52c41a;
    }
  }
`;

const i18n = {
  sensorGood: translate("common.deviceStatus.sensorGood"),
  sensorError: translate("common.deviceStatus.sensorError"),
  sensorMaintain: translate("common.deviceStatus.sensorMaintain"),
  overview: translate("common.overview"),
  list: translate("common.list"),
  statusSensor: translate("common.statusSensor"),
  statusData: translate("common.statusData"),

  dataLoss: translate("common.deviceStatus.dataLoss"),
  dataExceeded: translate("common.deviceStatus.dataExceeded"),
  dataExceededPrepare: translate("common.deviceStatus.dataExceededPrepare"),
  dataGood: translate("common.deviceStatus.dataGood")
};

const ListLoader = createContentLoader({
  component: <ListLoaderCp />,
  isAutoLoader: true,
  items: 5
})(null);

export const defaultFilter = {
  group: GROUP_OPTIONS[0].value,
  order: ORDER_OPTIONS[0].value,
  stationType: "",
  search: ""
};

@connect(
  state => ({}),
  {
    changeOpenSubMenu
  }
)
@withRouter
@autobind
@protectRole(ROLE.MONITORING.DATA_V2)
export default class MonitoringGeneral extends React.Component {
  state = {
    isLoading: false,
    isLoadedFirst: false,
    filter: getMonitoringFilter() ? getMonitoringFilter() : defaultFilter,
    data: [],
    province: null
  };

  appendWarningLevelStationAuto(stationAutoList) {
    return stationAutoList.map(stationAuto => {
      let totalWarning = 0;
      if (stationAuto.lastLog && stationAuto.lastLog.measuringLogs) {
        const measuringLogs = stationAuto.lastLog.measuringLogs;
        Object.keys(measuringLogs).forEach(key => {
          if (measuringLogs[key].warningLevel) {
            totalWarning++;
          }
        });
      }
      return {
        ...stationAuto,
        totalWarning
      };
    });
  }

  getTotalWarning(stationAutoList) {
    let totalWarning = 0;
    stationAutoList.forEach(item => {
      totalWarning += item.totalWarning;
    });
    return totalWarning;
  }

  async loadData() {
    this.setState({ isLoading: false });
    let dataStationTypes = await CategoriesApi.getStationTypes({
      page: 1,
      itemPerPage: 10
    });
    let dataStationAutos = await StationAutoApi.getLastLog();

    const tmp = _.get(dataStationTypes, "data", []);
    const dataMonitoring = _.map(tmp, stationType => {
      const stationAutoList = _.filter(
        _.get(dataStationAutos, "data", []),
        stationAuto => stationAuto.stationType.key === stationType.key
      );
      return {
        stationType,
        stationAutoList: this.appendWarningLevelStationAuto(stationAutoList),
        totalWarning: this.getTotalWarning(
          this.appendWarningLevelStationAuto(stationAutoList)
        )
      };
    });
    this.setState({
      data: dataMonitoring.length > 0 ? dataMonitoring : this.state.data,
      isLoading: true
    });
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.loadData.bind(this), 60000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  async componentWillMount() {
    this.props.changeOpenSubMenu([]);
    if (this.props.location) {
      const query = queryString.parse(this.props.location.search);
      if (query)
        this.handleChangeFilter({
          ...this.state.filter,
          stationType: query.Id
        });
    }
    await this.loadData();
    this.setState({
      isLoadedFirst: true
    });
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handleChangeFilter(filter) {
    this.setState({ filter }, this.forceUpdate);
    setMonitoringFilter(filter);
  }

  handleProvinceChange = province => {
    this.setState({
      province
    });
  };

  renderHeader(total, countGood) {
    const stationStatus = translate("dashboard.activeStationPer", {
      good: countGood,
      total
    });
    return (
      <div>
        <div>
          <HeaderDesc>
            <div className="left">
              <div style={{ minWidth: 70, marginRight: 12 }}>
                <span>
                  <img
                    src="/images/monitoring/tong-quan.png"
                    alt="tong-quan"
                    width={32}
                  />
                  {i18n.overview}
                </span>
              </div>
              <div style={{ minWidth: 70, marginRight: 12 }}>
                <span>
                  <img
                    src="/images/monitoring/danh-sach.png"
                    alt="danh-sach"
                    width={32}
                  />
                  {i18n.list}
                </span>
              </div>
              <div style={{ minWidth: 70, marginRight: 12, marginLeft: 32, fontWeght: 600 }}>
                <span>{i18n.statusSensor}</span>
              </div>
              <div style={{ minWidth: 70, marginRight: 12 }}>
                <span>
                  <img
                    style={{ marginRight: 4 }}
                    src="/images/sensor/error.png"
                    alt="error"
                    width={20}
                  />
                  {i18n.sensorError}
                </span>
              </div>
              <div style={{ minWidth: 70, marginRight: 12 }}>
                <span>
                  <img
                    style={{ marginRight: 4 }}
                    src="/images/sensor/maintain.png"
                    alt="maintain"
                    width={20}
                  />
                  {i18n.sensorMaintain}
                </span>
              </div>
              <div style={{ minWidth: 70, marginRight: 12 }}>
                <span>
                  <img
                    style={{ marginRight: 4 }}
                    src="/images/sensor/good.png"
                    alt="good"
                    width={20}
                  />
                  {i18n.sensorGood}
                </span>
              </div>
            </div>
            <div className="right">
              <div style={{ minWidth: 70, marginRight: 4, fontWeght: 600 }}>
                <span>{i18n.statusData}</span>
              </div>
              <div style={{ minWidth: 70, marginRight: 4 }}>
                <Tag className="data-loss">{i18n.dataLoss}</Tag>
              </div>
              <div style={{ minWidth: 70, marginRight: 4 }}>
                <Tag className="data-exceed">{i18n.dataExceeded}</Tag>
              </div>
              <div style={{ minWidth: 70, marginRight: 4 }}>
                <Tag className="data-extend-prepare">
                  {i18n.dataExceededPrepare}
                </Tag>
              </div>
              <div style={{ minWidth: 70, marginRight: 4 }}>
                <Tag className="data-good">{i18n.dataGood}</Tag>
              </div>
            </div>
          </HeaderDesc>
        </div>
        <ContainerHeader>
          <HeaderView
            stationStatus={stationStatus}
            onChange={this.handleProvinceChange}
          />
          <Header>
            <HeaderFilter
              filter={this.state.filter}
              onChange={this.handleChangeFilter.bind(this)}
            />
          </Header>
        </ContainerHeader>
      </div>
    );
  }

  sortNameList(data, key, asc = true, sortByValue = false) {
    if (sortByValue) {
      return _.orderBy(data, [key, "status"], [asc ? "asc" : "desc", "asc"]);
    }
    return _.orderBy(data, [key], [asc ? "asc" : "desc"]);
  }

  unGroupStation(stationTypeList) {
    if (stationTypeList.length === 0) return [];
    let newStationAutoList = [];
    stationTypeList.forEach(stationType => {
      stationType.stationAutoList.forEach(stationAuto => {
        newStationAutoList = [...newStationAutoList, stationAuto];
      });
    });
    if (this.state.filter.order === monitoringFilter.ORDER.NAME) {
      newStationAutoList = this.sortNameList(newStationAutoList, "name");
    }
    return [
      {
        stationType: {
          ...stationTypeList[0],
          name: translate("dataSearchFrom.form.all")
        },
        stationAutoList: newStationAutoList
      }
    ];
  }

  getFilterProvince = dataList => {
    let total = 0;
    let countGood = 0;
    const stationTypeList = _.map(
      dataList,
      ({ stationAutoList, totalWarning, stationType }) => {
        const rs = _.filter(
          stationAutoList || [],
          ({ name, province, status }) => {
            let hasFilterName = true;
            if (this.state.filter.search) {
              hasFilterName = _.includes(
                replaceVietnameseStr(name).toLowerCase(),
                replaceVietnameseStr(this.state.filter.search).toLowerCase()
              );
            }

            let hasStation =
              hasFilterName &&
              (!this.state.province ||
                _.isEqual(
                  _.get(province, "key", ""),
                  _.get(this.state.province, "key", "")
                ));
            if (hasStation) {
              total = total + 1;
              countGood = countGood + (_.isEqual(status, "GOOD") ? 1 : 0);
            }

            return hasStation;
          }
        );
        return {
          stationAutoList: rs,
          totalWarning,
          stationType
        };
      }
    );

    return {
      total,
      countGood,
      stationTypeList
    };
  };

  getData() {
    const dataResult = this.getFilterProvince(this.state.data);
    let stationTypeList = dataResult.stationTypeList;
    // console.log("stationTypeList: ", stationTypeList);
    // filter by STATION TYPE
    if (this.state.filter.stationType) {
      stationTypeList = stationTypeList.filter(
        stationType =>
          stationType.stationType.key === this.state.filter.stationType
      );
    }
    // filter by UNGROUP
    if (this.state.filter.group === monitoringFilter.GROUP.UNGROUP) {
      stationTypeList = this.unGroupStation(stationTypeList);
    }

    // filter by ORDER NAME
    if (this.state.filter.order === monitoringFilter.ORDER.NAME) {
      stationTypeList = this.sortNameList(
        stationTypeList,
        "stationType.name"
      ).map(stationType => {
        return {
          ...stationType,
          stationType: stationType.stationType,
          stationAutoList: this.sortNameList(
            stationType.stationAutoList,
            "name"
          )
        };
      });
    }

    // filter by values
    if (this.state.filter.order === monitoringFilter.ORDER.NUMBER) {
      stationTypeList = this.sortNameList(
        stationTypeList,
        "totalWarning",
        true,
        true
      ).map(stationType => {
        return {
          ...stationType,
          stationType: stationType.stationType,
          stationAutoList: this.sortNameList(
            stationType.stationAutoList,
            "totalWarning",
            false,
            true
          )
        };
      });
    }

    return {
      stationTypeList,
      total: dataResult.total,
      countGood: dataResult.countGood
    };
  }

  render() {
    const result = this.getData();
    return (
      <PageContainer
        style={{ height: 120 }}
        isLoading={!this.state.isLoadedFirst}
        backgroundColor="#fafbfb"
        headerCustom={this.renderHeader(result.total, result.countGood)}
        componentLoading={
          <div>
            <ListLoader />
          </div>
        }
      >
        <StationTypeList
          filter={this.state.filter}
          data={result.stationTypeList}
        />
        <Clearfix height={64} />
      </PageContainer>
    );
  }
}