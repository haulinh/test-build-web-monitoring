import React from "react";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import { translate } from "hoc/create-lang";
import Breadcrumb from "../breadcrumb";
import SearchForm from "./search-form";
import { getUrlReportStatusData } from "api/DataStationAutoApi";
import { Typography } from "antd";
import { get as _get } from "lodash";
import Clearfix from "components/elements/clearfix";

import { connect } from "react-redux";

const { Title, Text } = Typography;
const i18n = {
  title: translate("menuApp.report.status_data_obj.title")
};

@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, "auth.userInfo.organization.timeZone", null)
}))
export default class StatusDataReport extends React.Component {
  state = {
    isLoading: true
  };

  handleSubmit(values) {
    let url = getUrlReportStatusData(
      this.props.token,
      values.stationAutos,
      values.time[0],
      values.time[1]
    );
    console.log("getUrlReportStatusData", url);
    window.open(url);
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={["status_data"]} />
        <SearchForm
          cbSubmit={this.handleSubmit.bind(this)}
          isDatePicker={true}
        />
        <Clearfix height={16} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <Title level={4}>{i18n.title}</Title>
          <Text>
            {/* {translate("avgSearchFrom.table.description3", {
              stationName: this.state.stationName,
              monthYear: this.state.monthYear
            })} */}
          </Text>
        </div>
        <Clearfix height={8} />
      </PageContainer>
    );
  }
}
