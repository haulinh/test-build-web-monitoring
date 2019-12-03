import React from "react";
import styled from "styled-components";
import { Typography } from 'antd';

import DynamicTable from "components/elements/dynamic-table";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import DataLoggerSearchForm from './user-search-form'
import Breadcrumb from "./breadcrumb";
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'

const { Text } = Typography;
const DataLoggerWrapper = styled.div``;
const i18n = {
  emptyView:translate('dataLogger.list.emptyView'),
  colNo:translate('dataLogger.list.colNo'),
  colUser:translate('dataLogger.list.colUser'),
  colTime:translate('dataLogger.list.colTime'),
  colAction:translate('dataLogger.list.colAction'),
  colDevice:translate('dataLogger.list.colDevice'),

}

class DataLoggerPage extends React.Component {
  state = {
    isLoading: false,
    dataSource: []
  };

  getRows = () => {
    return []
  };
  getHead = () => {
    return [
      { content: i18n.colNo, width: 2 },
      { content: i18n.colUser},
      { content: i18n.colTime},
      { content: i18n.colAction},
      { content: i18n.colDevice},
      { content: ''},
    ]
  };

  getRenderEmpty = () =>{
    return  <div>
      <Clearfix heigth={16}/>
       <Text disabled>{i18n.emptyView}</Text>
    </div>

  }
  hanldeOnSubmit = (values) =>{
    console.log("hanldeOnSubmit",values)
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={["list"]} />
        <DataLoggerSearchForm onSubmit={this.hanldeOnSubmit}/>
        <DataLoggerWrapper>
          <DynamicTable
            loading={this.props.isLoading}
            rows={this.getRows()}
            head={this.getHead()}
            paginationOptions={{
              isSticky: true
            }}
          emptyView={this.getRenderEmpty()}
            // onSetPage={this.props.onChangePage}
            // pagination={this.props.pagination}
          />
        </DataLoggerWrapper>
      </PageContainer>
    );
  }
}

export default DataLoggerPage;
