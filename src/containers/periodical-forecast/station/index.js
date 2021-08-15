import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Divider,
  Button,
  Icon,
  Modal,
  message,
  Menu,
  Dropdown,
  Row,
  Col,
} from 'antd'
import { autobind } from 'core-decorators'
import * as _ from 'lodash'
import styled from 'styled-components'

/** */
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi.js'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'

import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import Breadcrumb from '../breadcrumb'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import DynamicTable from 'components/elements/dynamic-table'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date'

const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`
const IconButton = styled(Icon)`
  padding-right: 5px;
  color: ${props => (props.color ? props.color : '#3E90F7')};
`
const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

const i18n = {
  cancelText: translate('addon.cancel'),
  okText: translate('addon.ok'),
  restoreConfirmMsg: translate('confirm.msg.restore'),
  deleteConfirmMsg: translate('confirm.msg.delete'),
  disableConfirmMsg: translate('confirm.msg.disable'),
  edit: {
    label: translate('stationFixedPoint.edit.label'),
  },
  disable: {
    label: translate('stationFixedPoint.disable.label'),
  },
  list: {
    restore: translate('stationFixedPoint.list.restore'),
    remove: translate('stationAutoManager.list.remove'),
  },
  onDisable: {
    success: translate('addon.onDisable.success'),
    error: translate('addon.onDisable.error'),
  },
  onRestore: {
    success: translate('addon.onRestore.success'),
    error: translate('addon.onRestore.error'),
  },
}

@protectRole(ROLE.STATION_FIXED.VIEW)
@createManagerList({
  apiList: PeriodicForecastApi.getStationPeriodicForecast,
  itemPerPage: 1000,
})
@createManagerDelete({
  apiDelete: PeriodicForecastApi.deleteStation,
})
@createLanguageHoc
@autobind
export default class Station extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    pathImg: PropTypes.string,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes,
  }

  buttonAdd() {
    const {
      lang: { t },
    } = this.props
    return protectRole(ROLE.STATION_FIXED.CREATE)(
      <Link to={slug.periodicalForecast.stationCreate}>
        <Button type="primary">
          <Icon type="plus" />
          {t('addon.create')}
        </Button>
      </Link>
    )
  }

  getHead() {
    const {
      lang: { t },
    } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('stationFixedPoint.form.key.label') },
      { content: t('stationFixedPoint.form.name.label') },
      { content: t('stationFixedPoint.form.address.label') },
      { content: '', width: 20 },
    ]
  }

  getRows() {
    return this.props.dataSource.map((item, idx) => [
      {
        content: <strong>{idx + 1}</strong>,
      },
      {
        content: <div>{item.key}</div>,
      },
      {
        content: <div>{item.name}</div>,
      },
      {
        content: <div>{item.address}</div>,
      },
      {
        content: this.renderActionGroup(item),
      },
    ])
  }

  renderActionGroup = row => {
    let isActive = _.get(row, 'active', false)
    if (isActive) {
      return (
        <span>
          {protectRole(ROLE.STATION_FIXED.EDIT)(
            <Link to={slug.periodicalForecast.stationEdit + '/' + row._id}>
              {i18n.edit.label}
            </Link>
          )}

          <Divider type="vertical" />
          {protectRole(ROLE.STATION_FIXED.DELETE)(
            <a
              onClick={() =>
                this.handleOnDeactivate(row._id, this.props.fetchData)
              }
            >
              {i18n.disable.label}
            </a>
          )}
        </span>
      )
    } else {
      let dropDown = (
        <Menu
          style={{
            width: 120,
          }}
        >
          <Menu.Item key="1">
            <a
              onClick={() => this.onRestoreItem(row._id, this.props.fetchData)}
            >
              <IconButton type="reload" />
              {i18n.list.restore}
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a
              onClick={() =>
                this.props.onRemoveItem(row._id, this.props.fetchData)
              }
            >
              <IconButton type="close-square-o" color={'red'} />
              {i18n.list.remove}
            </a>
          </Menu.Item>
        </Menu>
      )
      return protectRole(ROLE.STATION_FIXED.DELETE)(
        <Dropdown overlay={dropDown} trigger={['click']}>
          <LinkSpan className="ant-dropdown-link">
            <Icon type="setting" style={{ fontSize: 20, color: '#3E90F7' }} />
          </LinkSpan>
        </Dropdown>
      )
    }
  }

  async handleOnDeactivate(_id, callback) {
    Modal.confirm({
      title: i18n.disableConfirmMsg,
      okText: i18n.okText,
      cancelText: i18n.cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await PeriodicForecastApi.deactivateStation(_id)
          if (res.status === 'ok') {
            message.success(i18n.onDisable.success)
            callback()
          } else message.error(i18n.onDisable.error)
          resolve()
        }).catch(() => {
          message.error(i18n.onDisable.error)
          console.log('Oops errors!')
        })
      },
      onCancel() {},
    })
  }

  async onRestoreItem(_id, callback) {
    Modal.confirm({
      title: i18n.restoreConfirmMsg,
      okText: i18n.okText,
      cancelText: i18n.cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await PeriodicForecastApi.activeStation(_id)
          if (res.status === 'ok') {
            message.info(i18n.onRestore.success)
            callback()
          } else message.error(i18n.onRestore.error)
          resolve()
        }).catch(() => {
          console.log('Oops errors!')
          message.error(i18n.onRestore.error)
        })
      },
      onCancel() {},
    })
  }

  render() {
    return (
      <PageContainer right={this.buttonAdd()}>
        <Breadcrumb items={['list']} />
        <DynamicTable
          loading={this.props.isLoading}
          rows={this.getRows()}
          head={this.getHead()}
          paginationOptions={{
            isSticky: true,
          }}
          onSetPage={this.props.onChangePage}
          pagination={this.props.pagination}
        />
      </PageContainer>
    )
  }
}
