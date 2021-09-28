import React from 'react'
import { Typography, message, Icon, Skeleton, Tabs } from 'antd'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'

import DynamicTable from 'components/elements/dynamic-table'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import languageApi from 'api/languageApi'
import DataSearchForm from './search-form'
import Breadcrumb from './breadcrumb'
import Clearfix from 'components/elements/clearfix'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
import { translate } from 'hoc/create-lang'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'
import JsonViewCustom from './json-view-custom'
import ListLanguage from './list-language'

const { Text } = Typography
const { TabPane } = Tabs

function i18n() {
  return {
    emptyView: translate('language.list.emptyView'),
    colSTT: translate('language.list.colSTT'),
    colKey: translate('language.list.colKey'),
    colDevice: translate('language.list.colDevice'),
    colFeature: translate('language.list.colFeature'),
    colVI: translate('language.list.colVI'),
    colEN: translate('language.list.colEN'),
    colTW: translate('language.list.colTW'),
    success: translate('addon.onSave.update.success'),
    error: translate('addon.onSave.update.error'),
    tab1: translate('language.tabs.tab1'),
    tab2: translate('language.tabs.tab2'),
  }
}

const VI = 'vi'
const EN = 'en'
const TW = 'tw'
// const MOBILE = 'MOBILE'
const WEB = 'WEB'
const TABS = ['list', 'detail']

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
    tabKey: '',
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

  handleOnChangeLanguage = async (value, locale, key, device) => {
    _.set(this.state.dataSource, `${device}.${locale}.${key}`, value)
    const data = _.get(this.state.dataSource, `${device}.${locale}`)
    let res = await languageApi.updateLanguage(locale, data, device)
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
      const dataInitialWeb = _.get(this.state.dataSource, [WEB, VI])
      dataWeb = _.map(_.keys(dataInitialWeb), key => {
        let dataEN = null
        let dataVI = null
        let dataTW = null
        const title = _.get(
          _.get(this.state.dataSource, [WEB]),
          `${this.props.language}.language.content.${key}`,
          key
        )
        dataVI = this.getContent(this.state.dataSource[WEB], VI, key, WEB)
        dataEN = this.getContent(this.state.dataSource[WEB], EN, key, WEB)
        dataTW = this.getContent(this.state.dataSource[WEB], TW, key, WEB)

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
                  this.handleOnChangeLanguage(data, VI, key, WEB)
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
                  this.handleOnChangeLanguage(data, TW, key, WEB)
                }}
                isEdit={true}
                dataStructure={dataVI}
                title={title}
                content={dataTW}
              />
            ),
          },
        ]
      })
    }

    //get data language Mobile
    // if (this.state.isMobile) {
    //   const dataInitialMobile = _.get(this.state.dataSource, [MOBILE, VI])
    //   dataMobile = _.map(_.keys(dataInitialMobile), key => {
    //     let dataEN = null
    //     let dataVI = null
    //     let dataTW = null
    //     const title = _.get(
    //       this.props.dataInitial,
    //       `${this.props.language}.language.content.${key}`,
    //       key
    //     )
    //     dataVI = this.getContent(dataInitialMobile, VI, key, MOBILE)
    //     dataEN = this.getContent(dataInitialMobile, EN, key, MOBILE)
    //     dataTW = this.getContent(dataInitialMobile, TW, key, MOBILE)

    //     index++
    //     return [
    //       {
    //         content: <strong>{index}</strong>,
    //       },
    //       {
    //         content: (
    //           <div style={{ display: 'flex', justifyContent: 'center' }}>
    //             <Icon style={{ fontSize: '1rem' }} type="mobile" />
    //           </div>
    //         ),
    //       },
    //       {
    //         content: key.toLocaleUpperCase(),
    //       },
    //       {
    //         content: title,
    //       },
    //       {
    //         content: (
    //           <JsonViewCustom
    //             onChange={data => {
    //               this.handleOnChangeLanguage(data, VI, key, true)
    //             }}
    //             isEdit={true}
    //             dataStructure={dataVI}
    //             title={title}
    //             content={dataVI}
    //           />
    //         ),
    //       },
    //       {
    //         content: (
    //           <JsonViewCustom
    //             title={title}
    //             dataStructure={dataVI}
    //             content={dataEN}
    //           />
    //         ),
    //       },
    //       {
    //         content: (
    //           <JsonViewCustom
    //             onChange={data => {
    //               this.handleOnChangeLanguage(data, TW, key, true)
    //             }}
    //             isEdit={true}
    //             dataStructure={dataVI}
    //             title={title}
    //             content={dataTW}
    //           />
    //         ),
    //       },
    //     ]
    //   })
    // }

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
      { content: i18n().colTW },
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
            {this.state.tabKey === TABS[1] && (
              <DataSearchForm onSubmit={this.handleOnSearch} />
            )}
          </HeaderSearchWrapper>
        }
        isLoading={false}
        componentLoading={<Skeleton paragraph={{ rows: 10 }} active />}
      >
        <Breadcrumb items={['list']} />

        <React.Fragment>
          <Tabs
            defaultActiveKey={TABS[0]}
            onChange={select => {
              console.log(select)
              this.setState({
                tabKey: select,
              })
            }}
          >
            <TabPane tab={i18n().tab1} key={TABS[0]}>
              <ListLanguage />
            </TabPane>
            <TabPane tab={i18n().tab2} key={TABS[1]}>
              {!this.state.isLoading && (
                <DynamicTable
                  loading={this.props.isLoading}
                  rows={this.getRows()}
                  head={this.getHead()}
                  paginationOptions={{
                    isSticky: true,
                  }}
                  emptyView={this.getRenderEmpty()}
                />
              )}
            </TabPane>
          </Tabs>
        </React.Fragment>
      </PageContainer>
    )
  }
}

export default ConfigLanguagePage
