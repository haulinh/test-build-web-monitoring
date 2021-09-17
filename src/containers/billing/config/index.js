import { Button, Divider, Icon } from 'antd'
import DataInsight from 'api/DataInsight'
import DynamicTable from 'components/elements/dynamic-table'
import { DD_MM_YYYY } from 'constants/format-date'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerList from 'hoc/manager-list'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../breadcrumb'

@protectRole(ROLE.PERIODICAL_STATION.VIEW)
@createManagerList({
  apiList: DataInsight.getConfigBilling,
  itemPerPage: 1000,
})
@createManagerDelete({
  apiDelete: DataInsight.deleteConfigBilling,
})
@createLanguageHoc
@autobind
export default class BillingList extends React.Component {
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
    return protectRole(ROLE.PERIODICAL_STATION.CREATE)(
      <Link to={slug.billing.configCreate}>
        <Button type="primary">
          <Icon type="plus" />
          {t('addon.create')}
        </Button>
      </Link>
    )
  }

  async handleDeleteItem(_id) {
    await this.props.onDeleteItem(_id, this.props.fetchData)
  }

  getHead() {
    const {
      lang: { t },
    } = this.props
    return [
      { content: '#', width: 2 },
      { content: t('billing.label.key') },
      { content: t('billing.label.name') },
      { content: t('billing.label.time') },
      { content: t('billing.label.note') },
      { content: '', width: 20 },
    ]
  }

  getRows() {
    const {
      location,
      lang: { t },
    } = this.props
    const style = { width: '200px', wordWrap: 'break-word' }
    return this.props.dataSource.map((item, idx) => {
      const timeEnd = item.timeEnd
        ? moment(item.timeEnd).format(DD_MM_YYYY)
        : t('billing.now')
      const time = `${moment(item.timeStart).format(DD_MM_YYYY)} → ${timeEnd} `
      return [
        {
          content: <strong>{idx + 1}</strong>,
        },
        {
          content: <div style={style}>{item.key}</div>,
        },
        {
          content: <div style={style}>{item.name}</div>,
        },
        {
          content: <div style={style}>{time}</div>,
        },
        {
          content: <div style={{ ...style, width: '350px' }}>{item.note}</div>,
        },
        {
          content: (
            <span>
              {protectRole(ROLE.SHARE_API.EDIT)(
                <Link to={`${location.pathname}/edit/${item._id}`}>
                  {t('global.edit')}
                </Link>
              )}
              <Divider type="vertical" />
              {protectRole(ROLE.SHARE_API.DELETE)(
                <a onClick={() => this.handleDeleteItem(item._id)}>
                  {t('global.delete')}
                </a>
              )}
            </span>
          ),
        },
      ]
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
