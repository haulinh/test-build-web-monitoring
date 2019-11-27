import React, { PureComponent } from "react";
import { Tabs, Button } from "antd";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import styled from "styled-components";
import Clearfix from "components/elements/clearfix";
import createBreadcrumb from "shared/breadcrumb/hoc";
import TabMucDo from "./tabMucDo";
import TabGiaTri from "./tabGiaTri";
import TabThongSo from "./tabThongSo";

const Breadcrumb = createBreadcrumb();
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const Wrapper = styled.div`
  .ant-collapse {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .ant-collapse-item {
    width: 50%;
  }
  .ant-collapse-header {
    text-align: center;
  }
`;


const TAB_KEY = {
  MUC_DO: "MUC_DO",
  GIA_TRI: "GIA_TRI",
  THONG_SO: "THONG_SO",
};
const TAB_NAME = {
  MUC_DO: "Ngưỡng mức độ",
  GIA_TRI: " Bảng giá trị BPi",
  THONG_SO: "Thống số tính toán",
};
@withRouter
@autobind
export default class ConfigCalculationAQI extends PureComponent {
  state = {
    tabKey: TAB_KEY.GIA_TRI
  };

  setTabActive = tabKey => {
    this.setState({
      tabKey
    });
  };

  render() {
    return (
      <PageContainer isLoading={false}>
        <Breadcrumb
          items={[
            {
              id: "1",
              name: "Cấu hình tính toán AQI"
            }
          ]}
        />
        <Wrapper>
          <Clearfix height={24} />
          <ButtonGroup style={{ display: "flex" }}>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.MUC_DO)}
              type={
                this.state.tabKey === TAB_KEY.MUC_DO ? "primary" : "default"
              }
              style={{ flex: 1 }}
            >
             {TAB_NAME.MUC_DO}
            </Button>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.GIA_TRI)}
              type={
                this.state.tabKey === TAB_KEY.GIA_TRI ? "primary" : "default"
              }
              style={{ flex: 1 }}
            >
              {TAB_NAME.GIA_TRI}
            </Button>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.THONG_SO)}
              type={
                this.state.tabKey === TAB_KEY.THONG_SO ? "primary" : "default"
              }
              style={{ flex: 1 }}
            >
               {TAB_NAME.THONG_SO}
            </Button>
          </ButtonGroup>
          <Tabs
            renderTabBar={() => {
              return <div />;
            }}
            activeKey={this.state.tabKey}
          >
            <TabPane tab="Ngưỡng mức độ" key={TAB_KEY.MUC_DO}>
              <Clearfix height={24} />
              <TabMucDo />
            </TabPane>
            <TabPane tab="Bảng giá trị BPi" key={TAB_KEY.GIA_TRI}>
            <Clearfix height={24} />
              <TabGiaTri />
            </TabPane>
            <TabPane tab="Thống số tính toán" key={TAB_KEY.THONG_SO}>
            <Clearfix height={24} />
              <TabThongSo />
            </TabPane>
          </Tabs>
        </Wrapper>
        <Clearfix height={50} />
      </PageContainer>
    );
  }
}
