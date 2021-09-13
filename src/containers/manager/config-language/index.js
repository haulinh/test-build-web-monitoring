import React from 'react'
import styled from 'styled-components'
import { Typography, message } from 'antd'

import DynamicTable from 'components/elements/dynamic-table'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import languageApi from 'api/languageApi'
import DataLoggerSearchForm from './user-search-form'
import Breadcrumb from './breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'

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
  colSTT: translate('language.list.colSTT'),
  colKey: translate('language.list.colKey'),
  colFeature: translate('language.list.colFeature'),
  colVI: translate('language.list.colVI'),
  colEN: translate('language.list.colEN'),
  colCN: translate('language.list.colCN'),
  success: translate('language.edit.success'),
  error: translate('language.edit.error'),
}
const VI = 'vi'
const EN = 'en'
const CN = 'cn'
@connectAutoDispatch(state => ({
  language: _.get(state, 'language.locale'),
  dataInitial: _.get(state, 'language.dataInitial'),
}))
class ConfigLanguagePage extends React.Component {
  state = {
    isLoading: true,
    dataSource: null,
  }

  componentDidMount = async () => {
    let res = await languageApi.getListLanguages()
    let { success, data } = res

    if (success) {
      this.setState({
        dataSource: data,
        isLoading: false,
      })
    }
  }

  handleOnChangeLanguage = async (value, locale, key) => {
    _.set(this.state.dataSource, `${locale}.${key}`, value)
    const data = _.get(this.state.dataSource, `${locale}`)
    let res = await languageApi.updateLanguage(locale, data, false)
    if (res && res.success) {
      message.success(i18n.success)
    } else {
      message.error(i18n.error)
    }
  }

  getContent = (language, key) => {
    let data = _.get(this.props.dataInitial, `${language}.${key}`)
    data = {
      ...data,
      ..._.get(this.state.dataSource, `${language}.${key}`),
    }
    return data
  }

  getRows = () => {
    const dataInitial = _.get(this.props.dataInitial, `${this.props.language}`)

    let index = 0

    return _.map(_.keys(dataInitial), key => {
      let dataEN = null
      let dataVI = null
      let dataCN = null
      const title = _.get(
        this.props.dataInitial,
        `${this.props.language}.language.content.${key}`,
        key
      )
      dataVI = this.getContent(VI, key)
      dataEN = this.getContent(EN, key)
      dataCN = this.getContent(CN, key)

      index++

      return [
        {
          content: <strong>{index}</strong>,
        },
        {
          content: key.toLocaleUpperCase(),
        },
        {
          content: title,
        },
        {
          content: <JsonViewCustom title={title} content={dataVI} />,
        },
        {
          content: <JsonViewCustom title={title} content={dataEN} />,
        },
        {
          content: (
            <JsonViewCustom
              onChange={data => {
                this.handleOnChangeLanguage(data, CN, key)
              }}
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
      { content: i18n.colSTT, width: 2 },
      { content: i18n.colKey },
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
