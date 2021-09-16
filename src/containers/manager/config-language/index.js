import React from 'react'
import { Typography, message, Icon, Skeleton } from 'antd'

import DynamicTable from 'components/elements/dynamic-table'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import languageApi from 'api/languageApi'
import DataSearchForm from './search-form'
import Breadcrumb from './breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'
import JsonViewCustom from './json-view-custom'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
const { Text } = Typography

function i18n() {
  return {
    emptyView: translate('language.list.emptyView'),
    colSTT: translate('language.list.colSTT'),
    colKey: translate('language.list.colKey'),
    colDevice: translate('language.list.colDevice'),
    colFeature: translate('language.list.colFeature'),
    colVI: translate('language.list.colVI'),
    colEN: translate('language.list.colEN'),
    colCN: translate('language.list.colCN'),
    success: translate('language.edit.success'),
    error: translate('language.edit.error'),
  }
}

const VI = 'vi'
const EN = 'en'
const CN = 'cn'
const MOBILE = 'mobile'
const WEB = 'web'

@connectAutoDispatch(state => ({
  language: _.get(state, 'language.locale'),
  dataInitial: _.get(state, 'language.dataInitial'),
}))
class ConfigLanguagePage extends React.Component {
  state = {
    isLoading: true,
    dataSource: null,
    isMobile: true,
    isWeb: true,
  }

  componentDidMount = async () => {
    let res = await languageApi.getListLanguageAll({})
    let { success, data } = res

    if (success) {
      this.setState({
        dataSource: data,
        isLoading: false,
      })
    }
  }

  handleOnChangeLanguage = async (value, locale, key, isMoblie = false) => {
    _.set(this.state.dataSource, `${locale}.${key}`, value)
    const data = _.get(this.state.dataSource, `${locale}`)
    let res = await languageApi.updateLanguage(locale, data, isMoblie)
    if (res && res.success) {
      message.success(i18n().success)
    } else {
      message.error(i18n().error)
    }
  }

  getContent = (dataInitial, language, key, device) => {
    let data = _.get(dataInitial, `${language}.${key}`)
    data = {
      ...data,
      ..._.get(this.state.dataSource, `${device}.${language}.${key}`),
    }
    return data
  }

  getRows = () => {
    let index = 0
    let dataWeb = []
    let dataMobile = []

    //get data language web
    if (this.state.isWeb) {
      const dataInitialWeb = _.get(this.props.dataInitial, VI)
      dataWeb = _.map(_.keys(dataInitialWeb), key => {
        let dataEN = null
        let dataVI = null
        let dataCN = null
        const title = _.get(
          this.props.dataInitial,
          `${this.props.language}.language.content.${key}`,
          key
        )
        dataVI = this.getContent(this.props.dataInitial, VI, key, WEB)
        dataEN = this.getContent(this.props.dataInitial, EN, key, WEB)
        dataCN = this.getContent(this.props.dataInitial, CN, key, WEB)

        index++

        return [
          {
            content: <strong>{index}</strong>,
          },
          {
            content: (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Icon style={{ fontSize: '1rem' }} type="global" />
              </div>
            ),
          },
          {
            content: key.toLocaleUpperCase(),
          },
          {
            content: title,
          },
          {
            content: (
              <JsonViewCustom
                onChange={data => {
                  this.handleOnChangeLanguage(data, VI, key)
                }}
                isEdit={true}
                dataStructure={dataVI}
                title={title}
                content={dataVI}
              />
            ),
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

    //get data language Mobile
    if (this.state.isMobile) {
      const dataInitialMobile = _.get(this.state.dataSource, [MOBILE, VI])
      dataMobile = _.map(_.keys(dataInitialMobile), key => {
        let dataEN = null
        let dataVI = null
        let dataCN = null
        const title = _.get(
          this.props.dataInitial,
          `${this.props.language}.language.content.${key}`,
          key
        )
        dataVI = this.getContent(dataInitialMobile, VI, key, MOBILE)
        dataEN = this.getContent(dataInitialMobile, EN, key, MOBILE)
        dataCN = this.getContent(dataInitialMobile, CN, key, MOBILE)

        index++
        return [
          {
            content: <strong>{index}</strong>,
          },
          {
            content: (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Icon style={{ fontSize: '1rem' }} type="mobile" />
              </div>
            ),
          },
          {
            content: key.toLocaleUpperCase(),
          },
          {
            content: title,
          },
          {
            content: (
              <JsonViewCustom
                onChange={data => {
                  this.handleOnChangeLanguage(data, VI, key, true)
                }}
                isEdit={true}
                dataStructure={dataVI}
                title={title}
                content={dataVI}
              />
            ),
          },
          {
            content: (
              <JsonViewCustom
                title={title}
                dataStructure={dataVI}
                content={dataEN}
              />
            ),
          },
          {
            content: (
              <JsonViewCustom
                onChange={data => {
                  this.handleOnChangeLanguage(data, CN, key, true)
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

    return [...dataWeb, ...dataMobile]
  }

  getHead = () => {
    return [
      { content: i18n().colSTT, width: 2 },
      { content: i18n().colDevice, width: 6 },
      { content: i18n().colKey },
      { content: i18n().colFeature },
      { content: i18n().colVI },
      { content: i18n().colEN },
      { content: i18n().colCN },
    ]
  }

  getRenderEmpty = () => {
    return (
      <div>
        <Clearfix heigth={16} />
        <Text disabled>{i18n().emptyView}</Text>
      </div>
    )
  }

  handleOnSearch = async value => {
    this.setState({
      isLoading: true,
    })
    console.log(value)
    let res = await languageApi.getListLanguageAll(value)
    let { success, data } = res

    if (success) {
      this.setState({
        dataSource: data,
        isLoading: false,
        isMobile: value.isMobile === false ? false : true,
        isWeb: value.isMobile === true ? false : true,
      })
    }
  }

  render() {
    return (
      <PageContainer
        center={
          <HeaderSearchWrapper>
            <DataSearchForm onSubmit={this.handleOnSearch} />
          </HeaderSearchWrapper>
        }
        isLoading={this.state.isLoading}
        componentLoading={<Skeleton paragraph={{ rows: 10 }} active />}
      >
        <Breadcrumb items={['list']} />
        {!this.state.isLoading && (
          <React.Fragment>
            <DynamicTable
              loading={this.props.isLoading}
              rows={this.getRows()}
              head={this.getHead()}
              paginationOptions={{
                isSticky: true,
              }}
              emptyView={this.getRenderEmpty()}
            />
          </React.Fragment>
        )}
      </PageContainer>
    )
  }
}

export default ConfigLanguagePage
