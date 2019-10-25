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
  GIA_TRI: "GIA_TRI"
};

@withRouter
@autobind
export default class ConfigCalculationAQI extends PureComponent {
  state = {
    tabKey: TAB_KEY.MUC_DO
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
              Ngưỡng mức độ
            </Button>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.GIA_TRI)}
              type={
                this.state.tabKey === TAB_KEY.GIA_TRI ? "primary" : "default"
              }
              style={{ flex: 1 }}
            >
              Giá trị quy chuẩn
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
            <TabPane tab="Giá trị quy chuẩn" key={TAB_KEY.GIA_TRI}>
            <Clearfix height={24} />
              <TabGiaTri />
            </TabPane>
          </Tabs>
        </Wrapper>

        <Clearfix height={50} />
      </PageContainer>
    );
  }
}
