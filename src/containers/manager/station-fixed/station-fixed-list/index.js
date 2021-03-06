import {
  Button,
  Col,
  Divider,
  Dropdown,
  Icon,
  Menu,
  message,
  Modal,
  Row,
} from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import DynamicTable from 'components/elements/dynamic-table'
import HeaderSearchWrapper from 'components/elements/header-search-wrapper'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerList from 'hoc/manager-list'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Breadcrumb from '../breadcrumb'
import StationFixedSearchForm from '../station-fixed-search'

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

function i18n() {
  return {
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
}

@protectRole(ROLE.STATION_FIXED.VIEW)
@createManagerList({
  apiList: StationFixedPeriodic.getStationFixedPeriodics,
  itemPerPage: 1000,
})
@createManagerDelete({
  apiDelete: StationFixedPeriodic.deleteStationFixedPeriodic,
})
@createLanguageHoc
@autobind
export default class StationFixedList extends React.Component {
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
      <Row type="flex" gutter={10}>
        <Col>
          <Link to={slug.stationFixed.importPoint}>
            <Button type="primary">
              <Icon type="plus" />
              {t('addon.addMulti')}
            </Button>
          </Link>
        </Col>
        <Col>
          <Link to={slug.stationFixed.create}>
            <Button type="primary">
              <Icon type="plus" />
              {t('addon.create')}
            </Button>
          </Link>
        </Col>
      </Row>
    )
  }

  handleSearch(values) {
    // console.log('Search values:', values)
    const where = {
      // name: values.name ? { like: values.name } : undefined,
      name: values.name,
      stationTypeId: values.stationTypeId,
    }

    if (this.props.onChangeSearch) this.props.onChangeSearch(where)
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
    let sourceSorted = _.orderBy(
      this.props.dataSource || [],
      ['stationType._id'],
      ['asc']
    )
    let stationCount = _.countBy(sourceSorted, 'stationType._id')

    let stationTypeArr = []
    const styled = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '300px',
    }

    let result = [].concat.apply(
      [],
      sourceSorted.map((row, index) => {
        //content Row
        let resultRow = [
          {
            content: <strong>{index + 1}</strong>,
          },
          {
            content: (
              <div
                style={{
                  ...styled,
                  width: '200px',
                }}
              >
                <Span deleted={!row.active}>{row.key}</Span>
              </div>
            ),
          },
          {
            content: (
              <div
                style={{
                  ...styled,
                  width: '200px',
                }}
              >
                <Span deleted={!row.active}>{row.name}</Span>
              </div>
            ),
          },
          {
            content: (
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '300px',
                }}
              >
                <Span deleted={!row.active}>{row.address}</Span>
              </div>
            ),
          },
          {
            content: this.renderActionGroup(row),
          },
        ]
        //check if Group exist or not
        if (row.stationType && stationTypeArr.indexOf(row.stationType._id) > -1)
          return [resultRow]
        else {
          stationTypeArr.push(row.stationType._id)
          return [
            [
              { content: '' },
              {
                content: (
                  <div>
                    <strong>
                      {row.stationType.name}
                      {stationCount[row.stationType._id]
                        ? '(' + stationCount[row.stationType._id] + ')'
                        : ''}
                    </strong>
                  </div>
                ),
              },
            ],
            resultRow,
          ]
        }
      })
    )
    return result
  }

  renderActionGroup = row => {
    let isActive = _.get(row, 'active', false)
    if (isActive) {
      return (
        <span>
          {protectRole(ROLE.STATION_FIXED.EDIT)(
            <Link to={slug.stationFixed.editWithKey + '/' + row._id}>
              {i18n().edit.label}
            </Link>
          )}

          <Divider type="vertical" />
          {protectRole(ROLE.STATION_FIXED.DELETE)(
            <a
              onClick={() =>
                this.handleOnDeactivate(row._id, this.props.fetchData)
              }
            >
              {i18n().disable.label}
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
              {i18n().list.restore}
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a
              onClick={() =>
                this.props.onRemoveItem(row._id, this.props.fetchData)
              }
            >
              <IconButton type="close-square-o" color={'red'} />
              {i18n().list.remove}
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
      title: i18n().disableConfirmMsg,
      okText: i18n().okText,
      cancelText: i18n().cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await StationFixedPeriodic.deactivateStationFixedPeriodic(
            _id
          )
          if (res.status === 'ok') {
            message.success(i18n().onDisable.success)
            callback()
          } else message.error(i18n().onDisable.error)
          resolve()
        }).catch(() => {
          message.error(i18n().onDisable.error)
          console.log('Oops errors!')
        })
      },
      onCancel() {},
    })
  }

  async onRestoreItem(_id, callback) {
    Modal.confirm({
      title: i18n().restoreConfirmMsg,
      okText: i18n().okText,
      cancelText: i18n().cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await StationFixedPeriodic.activeStationFixedPeriodic(_id)
          if (res.status === 'ok') {
            message.info(i18n().onRestore.success)
            callback()
          } else message.error(i18n().onRestore.error)
          resolve()
        }).catch(() => {
          console.log('Oops errors!')
          message.error(i18n().onRestore.error)
        })
      },
      onCancel() {},
    })
  }

  render() {
    return (
      <PageContainer
        center={
          <HeaderSearchWrapper flex={1}>
            <StationFixedSearchForm
              stationLength={this.props.pagination.totalItem}
              onChangeSearch={this.handleSearch}
              initialValues={this.props.data}
            />
          </HeaderSearchWrapper>
        }
        right={this.buttonAdd()}
      >
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
