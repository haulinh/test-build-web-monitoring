import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Divider, Button, Icon, Form } from 'antd'
import ProvinceApi from 'api/ProvinceApi'
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
import DynamicTable from 'components/elements/dynamic-table'
import * as _ from 'lodash'

@protectRole(ROLE.STATION_AUTO.VIEW)
@createManagerList({
  apiList: ProvinceApi.getProvices
})
@createManagerDelete({
  apiDelete: ProvinceApi.deleteProvince
})
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class ProvinceList extends React.Component {
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
        {protectRole(ROLE.PROVINCE.CREATE)(
          <Link to={slug.province.create}>
            <Button type="primary">
              <Icon type="plus" />
              {t('province.create.label')}
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
      { content: t('province.form.key.label'), width: 15 },
      { content: t('province.form.name.label'), width: 15 },
      { content: t('province.form.action'), width: 15 }
    ]
  }
  getRows() {
    const {
      lang: { t }
    } = this.props
    return _.get(this.props,'dataSource',[]).map((row, index) => [
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
            {protectRole(ROLE.PROVINCE.EDIT)(
              <Link to={slug.province.editWithKey + '/' + row._id}>
                {' '}
                {t('province.edit.label')}{' '}
              </Link>
            )}

            <Divider type="vertical" />
            {protectRole(ROLE.PROVINCE.DELETE)(
              <a
                onClick={() =>
                  this.props.onDeleteItem(row._id, this.props.fetchData)
                }
              >
                {t('province.delete.label')}
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
