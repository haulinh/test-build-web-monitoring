import React from 'react'
import {
  Typography,
  Dropdown,
  Icon,
  Menu,
  message,
  Skeleton,
  Tag,
  Modal,
} from 'antd'
import { FlagIcon } from 'react-flag-kit'
// import * as _ from 'lodash'
import styled from 'styled-components'

import { translate } from 'hoc/create-lang'
import DynamicTable from 'components/elements/dynamic-table'
import Clearfix from 'components/elements/clearfix'
import languageApi from 'api/languageApi'

const { Text } = Typography

const ComponentWrapper = styled.div``

function i18n() {
  return {
    emptyView: translate('language.list.emptyView'),
    colSTT: translate('language.list.colSTT'),
    colKey: translate('language.list.colKey'),
    colLanguage: translate('language.list.colLanguage'),
    colStatus: translate('language.list.colStatus'),
    success: translate('addon.onSave.update.success'),
    error: translate('addon.onSave.update.error'),
    resetConfirmMsg: translate('addon.onRestore.resetConfirmMsg'),
    resetSuccess: translate('addon.onRestore.success'),
    resetError: translate('addon.onRestore.error'),
    ok: translate('addon.ok'),
    cancel: translate('addon.cancel'),
  }
}

const color = ['#3E90F7', 'red']

const TW = 'tw'

class ListLanguage extends React.Component {
  state = {
    isLoading: true,
    dataSource: [],
  }

  static propTypes = {}

  async componentDidMount() {
    const response = await languageApi.getListLanguages({})
    const { success, data } = response
    if (success) {
      this.setState({
        isLoading: false,
        dataSource: data,
      })
    }
  }

  getRenderEmpty = () => {
    return (
      <div>
        <Clearfix heigth={16} />
        <Text disabled>{i18n().emptyView}</Text>
      </div>
    )
  }

  async handleEnable(locale, enable) {
    const response = await languageApi.putLanguageEnable({
      locale,
      enable: !enable,
    })
    const { success, data } = response
    if (success) {
      message.success(i18n().success)
      this.setState({
        dataSource: data,
      })
    }
  }

  async handleReset(locale) {
    Modal.confirm({
      title: i18n().resetConfirmMsg,
      okText: i18n().ok,
      cancelText: i18n().cancel,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await languageApi.resetLanguage(locale)
          if (res.success) {
            message.success(i18n().resetSuccess)
          } else message.success(i18n().resetError)
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  menu = (locale, enable) => {
    return (
      <Menu>
        <Menu.Item key="0" onClick={() => this.handleReset(locale)}>
          <Icon type="undo" style={{ fontSize: '1rem', color: color[0] }} />
          Reset to default
        </Menu.Item>
        {locale === TW && (
          <Menu.Item key="1" onClick={() => this.handleEnable(locale, enable)}>
            <Icon
              type="close-circle"
              style={{ fontSize: '1rem', color: color[1] }}
            />
            {enable ? 'Disable' : 'Enable'}
          </Menu.Item>
        )}
      </Menu>
    )
  }

  getRows() {
    return this.state.dataSource.map((element, index) => {
      return [
        {
          content: <strong>{index + 1}</strong>,
        },
        {
          content: <div>{element.locale}</div>,
        },
        {
          content: (
            <div>
              <FlagIcon code={element.flag} size={25} />
              {` `}
              {element.name}
            </div>
          ),
        },
        {
          content: (
            <Tag
              style={{
                width: '60px',
                textAlign: 'center',
              }}
              color={element.enable ? color[0] : color[1]}
            >
              {element.enable ? 'Enable' : 'Disable'}
            </Tag>
          ),
        },
        {
          content: (
            <div>
              <Dropdown
                overlay={this.menu(element.locale, element.enable)}
                trigger={['click']}
              >
                <Icon
                  type="setting"
                  style={{ fontSize: 20, color: color[0] }}
                />
              </Dropdown>
            </div>
          ),
        },
      ]
    })
  }

  render() {
    return (
      <ComponentWrapper>
        {this.state.isLoading && <Skeleton active />}
        {!this.state.isLoading && (
          <DynamicTable
            rows={this.getRows()}
            head={[
              { content: i18n().colSTT, width: 2 },
              { content: i18n().colKey },
              { content: i18n().colLanguage },
              { content: i18n().colStatus },
              { content: '', width: 8 },
            ]}
            paginationOptions={{
              isSticky: true,
            }}
            emptyView={this.getRenderEmpty()}
          />
        )}
      </ComponentWrapper>
    )
  }
}
export default ListLanguage
