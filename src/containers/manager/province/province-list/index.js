import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Divider, Button, Icon, Form, message } from 'antd'
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
import { getTotalCount_by_province } from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import LanguageContent from 'components/language/language-content'

function i18n() {
  return {
    errorDeleteProvince: translate('provinceManager.form.errorDeleteProvince'),
  }
}

@protectRole(ROLE.PROVINCE.VIEW)
@createManagerList({
  apiList: ProvinceApi.getProvinces,
})
@createManagerDelete({
  apiDelete: ProvinceApi.deleteProvince,
})
@Form.create({
  mapPropsToFields: mapPropsToFields,
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
    lang: langPropTypes,
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
      { content: t('province.form.action'), width: 15 },
    ]
  }

  getRows() {
    const {
      lang: { t },
    } = this.props
    return _.get(this.props, 'dataSource', []).map((row, index) => [
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
        content: row.key,
      },
      {
        content: (
          <LanguageContent type="Province" itemId={row._id} field="name" value={row.name} />
        )
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
              <a onClick={() => this.handleDeleteItem(row._id)}>
                {t('province.delete.label')}
              </a>
            )}
          </span>
        ),
      },
    ])
  }

  async handleDeleteItem(provinceId) {
    const countStation = await getTotalCount_by_province(provinceId)
    if (countStation.success) {
      if (countStation.count > 0) {
        message.error(i18n().errorDeleteProvince)
      } else {
        this.props.onDeleteItem(provinceId, this.props.fetchData)
      }
    }
  }

  render() {
    return (
      <PageContainer right={this.buttonAdd()}>
        <Breadcrumb items={['list']} />
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
