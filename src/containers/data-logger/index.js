import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import DynamicTable from 'components/elements/dynamic-table'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataLoggerSearchForm from './user-search-form'
import Breadcrumb from './breadcrumb'
import Clearfix from 'components/elements/clearfix'
import LogApi from 'api/LogApi.js'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import createManagerList from 'hoc/manager-list'
import ROLE from 'constants/role'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import moment from 'moment-timezone'

const { Text } = Typography
const DataLoggerWrapper = styled.div``
const i18n = {
  emptyView: translate('dataLogger.list.emptyView'),
  colNo: translate('dataLogger.list.colNo'),
  colUser: translate('dataLogger.list.colUser'),
  colTime: translate('dataLogger.list.colTime'),
  colAction: translate('dataLogger.list.colAction'),
  colDevice: translate('dataLogger.list.colDevice'),
  colDetail: translate('dataLogger.list.colDetail')
}

@protectRole(ROLE.XEM_NHAT_KY.VIEW)
@createManagerList({
  apiList: LogApi.getList
})
class DataLoggerPage extends React.Component {
  state = {
    isLoading: false
  }

  getRows = () => {
    return _.map(this.props.dataSource, (row, index) => {
      const dateLog = moment(row.createdAt).format(DD_MM_YYYY_HH_MM)
      const keyAction = _.toLower(_.get(row, 'action', ''))
      return [
        {
          content: (
            <strong>
              {(this.props.pagination.page - 1) *
                this.props.pagination.itemPerPage +
                index +
                1}
            </strong>
          )
        },
        {
          content: _.get(row, 'actor.email', '')
        },
        {
          content: dateLog
        },
        {
          content: translate(`dataLogger.action.${keyAction}`)
        },
        {
          content: _.get(row, 'deviceInfo.info.os.name', '')
        }
        // {
        //   content: (
        //     <a
        //     href="#"
        //       // onClick={() => this.onRestoreItem(row._id, this.props.fetchData)}
        //     >
        //       {i18n.colDetail}
        //     </a>
        //   )
        // }
      ]
    })
  }
  getHead = () => {
    return [
      { content: i18n.colNo, width: 2 },
      { content: i18n.colUser },
      { content: i18n.colTime },
      { content: i18n.colAction },
      { content: i18n.colDevice },
      { content: '' }
    ]
  }

  getRenderEmpty = () => {
    return (
      <div>
        <Clearfix heigth={16} />
        <Text disabled>{i18n.emptyView}</Text>
      </div>
    )
  }
  // hanldeOnSubmit = async values => {
  //   console.log("-----", values);
  //   try {
  //     const res = await LogApi.getList({ page: 1, itemPerPage: 50 }, values);
  //     console.log("--------------");
  //     console.log(res);

  //     if (res.success) {
  //       this.setstate({
  //         dataSource: _.get(res,'data',[])
  //       })
  //     }
  //   } catch (ex) {}
  // };

  render() {
    // console.log(this.props.dataSource, "---");
    return (
      <PageContainer>
        <Breadcrumb items={['list']} />
        <DataLoggerSearchForm onSubmit={this.props.onChangeSearch} />
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
    )
  }
}

export default DataLoggerPage
