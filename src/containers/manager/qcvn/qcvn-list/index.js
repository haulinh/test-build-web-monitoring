import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Divider, Button, Icon, Form, Menu, Dropdown } from 'antd'
import QCVNApi from 'api/QCVNApi'
import TestApi from 'api/ProvinceApi'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import styled from 'styled-components'

import DynamicTable from 'components/elements/dynamic-table'
const LinkSpan = styled.span`
  color: #000;
  &:hover {
    cursor: pointer;
  }
`
const SpanTimeAgo = styled.div`
  font-size: 13px;
  color: #707070;
`
const Span = styled.span`
  color: ${props => (props.deleted ? '#999999' : '')};
  text-decoration: ${props => (props.deleted ? 'line-through' : '')};
`

const IconButton = styled(Icon)`
  padding-right: 5px;
  color: ${props => (props.color ? props.color : '#3E90F7')};
`

@protectRole(ROLE.STATION_AUTO.VIEW)
@createManagerList({
   apiList: QCVNApi.getQCVN
})
@createManagerDelete({
  apiDelete: QCVNApi.deleteQCVN
})
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class QCVNList extends React.Component {
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
    lang: langPropTypes
  }

  buttonAdd() {
    const { t } = this.props.lang
    return (
      <div>
        {protectRole(ROLE.STATION_AUTO.CREATE)(
          <Link to={slug.qcvn.create}>
            <Button type="primary">
              <Icon type="plus" />
              {t('qcvn.create.label')}
            </Button>
          </Link>
        )}
      </div>
    )
  }
  getHead() {
    const { t } = this.props.lang
    return [
      { content: '#', width: 2 },
      { content: t('qcvn.form.key.label'), width: 15 },
      { content: t('qcvn.form.name.label'), width: 15 },
      { content: t('stationAutoManager.list.createdAt'), width: 10 }
    ]
  }

  getRows() {
    const { lang: { t } } = this.props
    return this.props.dataSource.map((row, index) => [
      {
        content: (
          <strong>
            {(this.props.pagination.page - 1) *
              this.props.pagination.itemPerPage +
              index +
              1}
          </strong>
        )
      },
      {
        content: row.key
      },
      {
        content: row.name
      },
      {
        content: (
          <span>
            {protectRole(ROLE.STATION_AUTO.EDIT)(
              <Link to={slug.qcvn.editWithKey + '/' + row._id}>
                {' '}
                {t('qcvn.edit.label')}{' '}
              </Link>
            )}

            <Divider type="vertical" />
            {protectRole(ROLE.STATION_AUTO.DELETE)(
              <a
                onClick={() =>
                  this.props.onDeleteItem(row._id, this.props.fetchData)
                }
              >
                {t('qcvn.delete.label')}
              </a>
            )}
          </span>
        )
      }
    ])
  }

  render() {
    return (
      <PageContainer right={this.buttonAdd()}>
        <Breadcrumb items={['list']} />
        <DynamicTable
          isFixedSize
          isLoading={this.props.isLoading}
          paginationOptions={{
            isSticky: true
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
