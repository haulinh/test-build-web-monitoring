import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Divider, Button, Icon, Form } from 'antd'
import QCVNApi from 'api/QCVNApi'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createManagerList from 'hoc/manager-list'
import createManagerDelete from 'hoc/manager-delete'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import DynamicTable from 'components/elements/dynamic-table'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date.js'

const i18n = {
  begin: {
    label: translate('qcvn.form.begin.label'),
  },
  expired: {
    label: translate('qcvn.form.expired.label'),
    isApplying: translate('qcvn.form.expired.stillWork'),
  },
}

@protectRole(ROLE.QCVN.VIEW)
@createManagerList({
  apiList: QCVNApi.getQCVN,
})
@createManagerDelete({
  apiDelete: QCVNApi.deleteQCVN,
})
@Form.create({
  mapPropsToFields: mapPropsToFields,
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
    lang: langPropTypes,
  }

  static defaultProps = {
    dataSource: [],
  }

  buttonAdd() {
    const { t } = this.props.lang
    return (
      <div>
        {protectRole(ROLE.QCVN.CREATE)(
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
      { content: i18n.begin.label, width: 15 },
      { content: i18n.expired.label, width: 15 },
      { content: t('stationAutoManager.list.action'), width: 10 },
    ]
  }

  getRows() {
    // console.log(this.props.dataSource)
    const {
      lang: { t },
    } = this.props
    return this.props.dataSource.map((row, index) => [
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
        content: row.name,
      },
      {
        content: row.begin ? moment(row.begin).format(DD_MM_YYYY) : '',
      },
      {
        content: row.expired
          ? moment(row.expired).format(DD_MM_YYYY)
          : i18n.expired.isApplying,
      },
      {
        content: (
          <span>
            {protectRole(ROLE.QCVN.EDIT)(
              <Link to={slug.qcvn.editWithKey + '/' + row._id}>
                {' '}
                {t('qcvn.edit.label')}{' '}
              </Link>
            )}

            <Divider type="vertical" />
            {protectRole(ROLE.QCVN.DELETE)(
              <a
                onClick={() =>
                  this.props.onDeleteItem(row._id, this.props.fetchData)
                }
              >
                {t('qcvn.delete.label')}
              </a>
            )}
          </span>
        ),
      },
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
