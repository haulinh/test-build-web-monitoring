import React from "react";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import { translate } from "hoc/create-lang";
import { connect } from "react-redux";
import Breadcrumb from "../breadcrumb";
import { get as _get, pick as _pick } from "lodash";
import SearchForm from "../search-form-2";
import { Table, Typography, Button, Spin } from "antd";
import Clearfix from "components/elements/clearfix";
import moment from "moment-timezone";
import { MM_YYYY, DD_MM_YYYY } from "constants/format-date.js";
import {
  getUrlReportType10,
  getUrlReportType10Excel
} from "api/DataStationAutoApi";
import { getFormatNumber, ROUND_DIGIT } from "constants/format-number";

const { Title, Text } = Typography;

const i18n = {
  header1: translate("avgSearchFrom.table.header1"),
  header2: translate("avgSearchFrom.table.header2"),
  header3: translate("avgSearchFrom.table.header3"),
  header4: translate("avgSearchFrom.table.header4"),
  header5: translate("avgSearchFrom.table.header5"),
  header6: translate("avgSearchFrom.table.header6"),
  title: translate("avgSearchFrom.table.title")
};

@connect(state => ({
  timeZone: _get(state, "auth.userInfo.organization.timeZone", null)
}))
export default class ReportType10 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHaveData: false,
      isLoading: false,
      isLoadingExcel: false,
      dataSource: [],
      dataSearch: null,
      fromMonth: "",
      toMonth: ""
    };
  }
  componentDidMount() {
    // console.log("ABC", this.props.timeZone);
  }

  getColumns = () => {
    return [
      {
        title: i18n.header1,
        dataIndex: "name"
      },
      {
        title: i18n.header6,
        dataIndex: "activatedAt",
        render: value => {
          if (!value) {
            return null;
          }
          return (
            <div>
              {moment(value)
                .tz(_get(this.props, "timeZone.value", ""))
                .format(DD_MM_YYYY)}
            </div>
          );
        }
      },
      {
        title: i18n.header2,
        dataIndex: "dataFrequency",
        align: "right"
      },
      {
        title: i18n.header3,
        dataIndex: "totalDesign",
        align: "right",
        render: value => {
          return <div>{getFormatNumber(value, 0)}</div>;
        }
      },
      {
        title: i18n.header4,
        dataIndex: "totalFact",
        align: "right",
        render: value => {
          return <div>{getFormatNumber(value, 0)}</div>;
        }
      },
      {
        title: i18n.header5,
        dataIndex: "percentageReceived",
        align: "right",
        render: value => {
          if (!value) return null;
          return <div>{getFormatNumber(value, ROUND_DIGIT)}</div>;
        }
      }
    ];
  };

  handleSubmit = async values => {
    // console.log(values, "values");
    this.setState({
      isHaveData: false,
      isLoading: true
    });
    const res = await getUrlReportType10(
      _pick(values, ["stationType", "fromDate", "toDate"])
    );
    if (res.success) {
      this.setState({
        dataSource: res.data,
        isHaveData: true,
        isLoading: false,
        dataSearch: _pick(values, ["stationType", "fromDate", "toDate"]),
        fromMonth: moment(values.fromMonth).format(MM_YYYY),
        toMonth: moment(values.toMonth).format(MM_YYYY)
      });
    }
  };

  hanldeExcel = async () => {
    this.setState({
      isLoadingExcel: true
    });
    let res = await getUrlReportType10Excel(this.state.dataSearch);

    if (res.success) {
      this.setState({
        isLoadingExcel: false
      });
      // console.log("getUrlReportType1", res.data);
      window.open(res.data, "_blank");
    }
  };

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={["type10"]} />
        <SearchForm cbSubmit={this.handleSubmit} />
        <Clearfix height={16} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <Title level={4}>{i18n.title}</Title>
          <Text>
            {" "}
            {translate("avgSearchFrom.table.description", {
              fromMonth: this.state.fromMonth,
              toMonth: this.state.toMonth
            })}
          </Text>
          {this.state.isHaveData && (
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px"
              }}
            >
              <Button
                type="primary"
                icon="file-excel"
                loading={this.state.isLoadingExcel}
                onClick={this.hanldeExcel}
              >
                {translate("avgSearchFrom.tab.exportExcel")}
              </Button>
            </div>
          )}
        </div>
        <Clearfix height={8} />
        <Spin spinning={this.state.isLoading}>
          <Table
            size="small"
            rowKey="_id"
            columns={this.getColumns()}
            bordered={true}
            dataSource={this.state.dataSource}
            locale={{ emptyText: translate("dataSearchFrom.table.emptyText") }}
            pagination={false}
          />
        </Spin>
      </PageContainer>
    );
  }
}
