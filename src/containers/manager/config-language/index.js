import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import DynamicTable from 'components/elements/dynamic-table'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataLoggerSearchForm from './user-search-form'
import Breadcrumb from './breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import languages from 'languages'

// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'

// import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
// import moment from 'moment-timezone'
import JsonViewCustom from './json-view-custom'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'

const { Text } = Typography
const DataLoggerWrapper = styled.div``
const i18n = {
  emptyView: translate('language.list.emptyView'),
  colFeature: translate('language.list.colFeature'),
  colVI: translate('language.list.colVI'),
  colEN: translate('language.list.colEN'),
  colCN: translate('language.list.colCN'),
}

@connectAutoDispatch(state => ({
  dataMenu: state.auth.userInfo.organization.menu,
}))
class ConfigLanguagePage extends React.Component {
  state = {
    isLoading: true,
    dataSource: null,
  }

  componentDidMount = () => {
    const data = languages()
    console.log(data)
    this.setState({
      dataSource: data,
      isLoading: false,
    })
  }

  getRows = () => {
    return _.map(this.props.dataMenu, ({ description, key }, index) => {
      let dataEN = null
      let dataVI = null
      let dataCN = null
      const title = description
      dataVI = _.get(this.state.dataSource, `vi.${key}`)
      dataEN = _.get(this.state.dataSource, `en.${key}`)
      dataCN = _.get(this.state.dataSource, `cn.${key}`)
      if (key === 'dashboard') {
        // console.log(description, key, '--dataMenu--')
        // console.log(dataVI, '---dataVI--')
      }
      // translate(`menuApp`)
      return [
        {
          content: <strong>{description}</strong>,
        },
        {
          content: (
            <JsonViewCustom isEdit={true} title={title} content={dataVI} />
          ),
        },
        {
          content: <JsonViewCustom title={title} content={dataEN} />,
        },
        {
          content: (
            <JsonViewCustom
              isEdit={true}
              dataStructure={dataVI}
              title={title}
              content={dataCN}
            />
          ),
        },
      ]
    })
  }
  getHead = () => {
    return [
      { content: i18n.colFeature },
      { content: i18n.colVI },
      { content: i18n.colEN },
      { content: i18n.colCN },
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

  render() {
    return (
      <PageContainer
        center={
          <HeaderSearchWrapper>
            <DataLoggerSearchForm onSubmit={this.props.onChangeSearch} />
          </HeaderSearchWrapper>
        }
      >
        <Breadcrumb items={['list']} />
        {!this.state.isLoading && (
          <DataLoggerWrapper>
            <DynamicTable
              loading={this.props.isLoading}
              rows={this.getRows()}
              head={this.getHead()}
              paginationOptions={{
                isSticky: true,
              }}
              emptyView={this.getRenderEmpty()}
              // onSetPage={this.props.onChangePage}
              // pagination={this.props.pagination}
            />
          </DataLoggerWrapper>
        )}
      </PageContainer>
    )
  }
}

export default ConfigLanguagePage
