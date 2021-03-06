import { Button, Divider, Icon } from 'antd'
import CategoryApi from 'api/CategoryApi'
import DynamicTable from 'components/elements/dynamic-table'
import LanguageContent from 'components/language/language-content'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { autobind } from 'core-decorators'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerList from 'hoc/manager-list'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteMeasure } from 'redux/actions/globalAction'
import Breadcrumb from '../breadcrumb'
import MeasuringSearchForm from '../measuring-search'
import MeasuringSearchAdvancedForm from '../measuring-search/advanced'

@protectRole(ROLE.MEASURING.VIEW)
@createManagerList({
  apiList: CategoryApi.getMeasurings,
})
@createManagerDelete({
  apiDelete: CategoryApi.deleteMeasuring,
})
@connect(null, dispatch => ({
  deleteMeasure: measureKey => dispatch(deleteMeasure(measureKey)),
}))
@createLanguage
@autobind
export default class MeasuringList extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onDeleteItem: PropTypes.func,
    fetchData: PropTypes.func,
    lang: langPropTypes,
  }

  state = {
    isAdvanced: false,
  }

  toggleAdvanced() {
    this.setState({
      isAdvanced: !this.state.isAdvanced,
    })
  }

  buttonAdd() {
    const {
      lang: { t },
    } = this.props
    return (
      <div>
        {protectRole(ROLE.MEASURING.CREATE)(
          <Link to={slug.measuring.create}>
            <Button type="primary">
              <Icon type="plus" /> {t('addon.create')}
            </Button>
          </Link>
        )}
      </div>
    )
  }

  getHead() {
    const {
      lang: { t },
    } = this.props
    return [
      // { content: '#', width: 2 },
      // { content: 'Key', width: 30 },
      // { content: 'Name', width: 10 },
      // { content: 'Unit', width: 10 },
      // { content: 'Action', width: 10 }
      { content: '#', width: 2 },
      { content: t('measuringManager.form.key.label'), width: 30 },
      { content: t('measuringManager.form.name.label'), width: 10 },
      { content: t('measuringManager.form.unit.label'), width: 10 },
      { content: t('measuringManager.form.action.label'), width: 10 },
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
          <LanguageContent
            type="Measure"
            itemKey={row.key}
            value={row.name}
            field="name"
          />
        ),
      },
      {
        content: row.unit,
      },
      {
        content: (
          <span>
            {protectRole(ROLE.MEASURING.EDIT)(
              <Link to={slug.measuring.editWithKey + '/' + row._id}>
                {' '}
                {t('measuringManager.edit.label')}{' '}
              </Link>
            )}
            <Divider type="vertical" />
            {protectRole(ROLE.MEASURING.DELETE)(
              <a onClick={() => this.handleOnDelete(row._id, row.key)}>
                {t('measuringManager.delete.label')}
              </a>
            )}
          </span>
        ),
      },
    ])
  }

  callBackDelete = key => {
    const { fetchData, deleteMeasure } = this.props
    deleteMeasure(key)
    fetchData()
  }
  async handleOnDelete(_id, key) {
    const { onDeleteItem } = this.props
    onDeleteItem(_id, () => this.callBackDelete(key))
  }

  renderSearchForm() {
    return (
      <MeasuringSearchForm
        onChangeSearch={this.props.onChangeSearch}
        initialValues={this.props.data}
        isAdvanced={this.state.isAdvanced}
        onAdvanced={this.toggleAdvanced}
      />
    )
  }

  renderSearchAdvanced() {
    if (!this.state.isAdvanced) return null
    return (
      <MeasuringSearchAdvancedForm
        onChangeSearch={this.props.onChangeSearch}
        initialValues={this.props.data}
        onAdvanced={this.toggleAdvanced}
      />
    )
  }

  render() {
    return (
      <PageContainer
        center={this.renderSearchForm()}
        headerBottom={this.renderSearchAdvanced()}
        right={this.buttonAdd()}
        backgroundColor={'#fff'}
      >
        <Breadcrumb items={['list']} />
        <DynamicTable
          isLoading={this.props.isLoading}
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
