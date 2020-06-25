import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Icon, Form, Menu, Dropdown } from 'antd'
import StationAutoApi from 'api/StationAuto'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import StationAutoSearchForm from '../station-auto-search.1'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import styled from 'styled-components'
import { Modal, message } from 'antd'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'

import DynamicTable from 'components/elements/dynamic-table'

const i18n = {
  cancelText: translate('addon.cancel'),
  okText: translate('addon.ok'),
  restoreConfirmMsg: translate('confirm.msg.restore'),
  deleteConfirmMsg: translate('confirm.msg.delete'),
}

const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`

const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

const IconButton = styled(Icon)`
  padding-right: 5px;
  color: ${props => (props.color ? props.color : '#3E90F7')};
`

@protectRole(ROLE.CAU_HINH_KET_NOI.VIEW)
@createManagerList({
  apiList: StationAutoApi.getStationAutos,
})
@createManagerDelete({
  apiDelete: StationAutoApi.removeStationAuto,
})
@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@autobind
export default class StationAutoConfigConnection extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onRemoveItem: PropTypes.func,
    fetchData: PropTypes.func,
    onChangeSearch: PropTypes.func,
    data: PropTypes.object,
    lang: langPropTypes,
  }

  static defaultProps = {
    dataSource: [],
  }

  async onDeleteItem(_id, callback) {
    const {
      lang: { t },
    } = this.props
    Modal.confirm({
      title: i18n.deleteConfirmMsg,
      okText: i18n.okText,
      cancelText: i18n.cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await StationAutoApi.deleteStationAuto(_id)
          if (res.success) {
            message.info(t('addon.onDelete.success'))
            callback()
          } else message.error(t('addon.onDelete.error'))
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  async onRestoreItem(_id, callback) {
    const {
      lang: { t },
    } = this.props
    Modal.confirm({
      title: i18n.restoreConfirmMsg,
      okText: i18n.okText,
      cancelText: i18n.cancelText,
      onOk() {
        return new Promise(async (resolve, reject) => {
          const res = await StationAutoApi.restoreStationAuto(_id)
          if (res.success) {
            message.info(t('addon.onRestore.success'))
            callback()
          } else message.error(t('addon.onRestore.error'))
          resolve()
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }

  getHead() {
    const { t } = this.props.lang
    return [
      { content: '#', width: 2 },
      { content: t('stationAutoManager.form.key.label'), width: 15 },
      { content: t('stationAutoManager.form.name.label'), width: 15 },
      { content: t('stationAutoManager.form.address.label'), width: 20 },
      { content: t('stationAutoManager.list.action'), width: 15 },
    ]
  }

  getRows() {
    let stationTypeArr = []

    let sourceSorted = _.orderBy(
      this.props.dataSource || [],
      ['stationType.key'],
      ['asc']
    )

    let stationCount = _.countBy(sourceSorted, 'stationType.key')
    //logic return groupRow or groupRow and Row
    let result = [].concat.apply(
      [],
      sourceSorted.map((row, index) => {
        //content Row
        let resultRow = [
          {
            content: (
              <strong>
                {(this.props.pagination.page - 1) *
                  this.props.pagination.itemPerPage +
                  index +
                  1}
              </strong>
            ),
          },
          {
            content: (
              <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                &emsp;
                {row.key}
              </Span>
            ),
          },
          {
            content: (
              <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                {row.name}
              </Span>
            ),
          },
          {
            content: (
              <Span deleted={row.removeStatus && row.removeStatus.allowed}>
                {row.address}
              </Span>
            ),
          },
          {
            content: this.actionGroup(row),
          },
        ]
        //check if Group exist or not
        if (row.stationType && stationTypeArr.indexOf(row.stationType.key) > -1)
          return [resultRow]
        else {
          stationTypeArr.push(row.stationType.key)
          return [
            [
              { content: '' },
              {
                content: (
                  <div>
                    <strong>
                      {row.stationType.name}{' '}
                      {stationCount[row.stationType.key]
                        ? '(' + stationCount[row.stationType.key] + ')'
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

  actionGroup(row) {
    const {
      lang: { t },
    } = this.props

    let defaultComp = <div />

    let isRemoveStatusAllowed = _.get(row, 'removeStatus.allowed', false)
    if (isRemoveStatusAllowed) {
      let dropDown = protectRole(ROLE.STATION_AUTO.DELETE)(
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
              {t('stationAutoManager.list.restore')}
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a
              onClick={() =>
                this.props.onRemoveItem(row._id, this.props.fetchData)
              }
            >
              <IconButton type="close-square-o" color={'red'} />
              {t('stationAutoManager.list.remove')}
            </a>
          </Menu.Item>
        </Menu>
      )

      defaultComp = (
        <Dropdown overlay={dropDown} trigger={['click']}>
          <LinkSpan className="ant-dropdown-link">
            <Icon type="setting" style={{ fontSize: 20, color: '#3E90F7' }} />
          </LinkSpan>
        </Dropdown>
      )
    } else {
      // console.log('---row---: ', row)
      defaultComp = (
        <Row>
          {/* Trường nói không hiện chức năng này tạm thời */}
          {/* {protectRole(ROLE.CAU_HINH_KET_NOI.FTP_FLODER)(
            <Link to={slug.stationAuto.configConnection.ftp + '/' + row._id}>
              {t('roleManager.rule.actions.fTPFloder')}
            </Link>
          )}
          &nbsp;|&nbsp; */}
          {protectRole(ROLE.CAU_HINH_KET_NOI.FILE_MAPPING)(
            <Link to={slug.stationAuto.configConnection.file + '/' + row._id}>
              {t('roleManager.rule.actions.fileMapping')}
            </Link>
          )}
        </Row>
      )
    }

    return defaultComp
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['config']} />

        {/* FORM CONTROL */}
        <Row style={{ marginBottom: 20 }}>
          <StationAutoSearchForm
            onChangeSearch={this.props.onChangeSearch}
            initialValues={this.props.data}
          />
        </Row>

        {/* TABLE */}
        <DynamicTable
          isFixedSize
          isLoading={this.props.isLoading}
          paginationOptions={{
            isSticky: true,
          }}
          head={this.getHead()}
          rows={this.getRows()}
          pagination={this.props.pagination}
          onSetPage={this.props.onChangePage}
        />
      </PageContainer>
    )
  }
}
