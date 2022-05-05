import { message, Skeleton, Tabs } from 'antd'
import languageApi from 'api/languageApi'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
import ROLE from 'constants/role'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import * as _ from 'lodash'
import React from 'react'
import { connectAutoDispatch } from 'redux/connect'
import Breadcrumb from './breadcrumb'
import ListLanguage from './list-language'
import DataSearchForm from './search-form'
import TableTranslate from './translate'

const { TabPane } = Tabs

export function i18n() {
  return {
    emptyView: translate('language.list.emptyView'),
    colSTT: translate('language.list.colSTT'),
    colKey: translate('language.list.colKey'),
    colDevice: translate('language.list.colDevice'),
    colFeature: translate('language.list.colFeature'),
    vi: translate('language.list.colVI'),
    en: translate('language.list.colEN'),
    tw: translate('language.list.colTW'),
    success: translate('addon.onSave.update.success'),
    error: translate('addon.onSave.update.error'),
    tab1: translate('language.tabs.tab1'),
    tab2: translate('language.tabs.tab2'),
  }
}

export const DEVICE = {
  MOBILE: 'MOBILE',
  WEB: 'WEB',
}

const TABS = ['list', 'detail']

@protectRole(ROLE.LANGUAGES.VIEW)
@connectAutoDispatch(state => ({
  language: _.get(state, 'language.locale'),
  dataInitial: _.get(state, 'language.dataInitial'),
  listLanguage: _.get(state, 'language.listLanguage'),
}))
class ConfigLanguagePage extends React.Component {
  state = {
    isLoading: true,
    dataSource: null,
    data: {},
    tabKey: '',
    isExpandAllRows: false,
    device: '',
    pattern: '',
    dataSourceOriginal: {},
  }

  componentDidMount = async () => {
    let res = await languageApi.getListLanguageAll({})
    let { success, data } = res

    if (success) {
      this.setState({
        dataSource: data,
        dataSourceOriginal: data,
      })
    }
    this.setState({ isLoading: false })
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

  handleOnSearch = async value => {
    this.setState({
      isLoading: true,
      isExpandAllRows: Boolean(value.pattern),
    })
    let res = await languageApi.getListLanguageAll(value)
    let { success, data } = res

    if (success) {
      this.setState({
        dataSource: data,
        device: value.device,
        pattern: value.pattern,
      })
    }

    this.setState({
      isLoading: false,
    })
  }

  render() {
    const {
      dataSource,
      dataSourceOriginal,
      isLoading,
      isExpandAllRows,
      device,
      pattern,
    } = this.state
    return (
      <PageContainer
        center={
          <HeaderSearchWrapper>
            {this.state.tabKey === TABS[1] && (
              <DataSearchForm
                listLanguage={this.props.listLanguage}
                language={this.props.language}
                onSubmit={this.handleOnSearch}
              />
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
              this.setState({
                tabKey: select,
              })
            }}
          >
            <TabPane tab={i18n().tab1} key={TABS[0]}>
              <ListLanguage />
            </TabPane>
            <TabPane tab={i18n().tab2} key={TABS[1]}>
              <TableTranslate
                isExpandAllRows={isExpandAllRows}
                loading={isLoading}
                dataSource={dataSource}
                dataSourceOriginal={dataSourceOriginal}
                device={device}
                pattern={pattern}
              />
            </TabPane>
          </Tabs>
        </React.Fragment>
      </PageContainer>
    )
  }
}

export default ConfigLanguagePage
