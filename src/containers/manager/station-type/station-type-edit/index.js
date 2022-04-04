import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon, Spin } from 'antd'
import { autobind } from 'core-decorators'
import CategoryApi from 'api/CategoryApi'
import StationTypeFrom from '../station-type-form'
import slug from '/constants/slug'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import {connect} from 'react-redux'
import {getContent} from 'components/language/language-content'

@protectRole(ROLE.STATION_TYPE.EDIT)
@createManagerDelete({
  apiDelete: CategoryApi.deleteStationType,
})
@createManagerEdit({
  apiUpdate: CategoryApi.updateStationType,
  apiGetByKey: CategoryApi.getStationType,
})
@connect(
  state => ({
    languageContents: state.language.languageContents
  }))
@autobind
export default class StationTypeEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }
  state = {
    dataSource: null,
  }

  async handleSubmit(data, onSuccess) {
    this.setState({dataSource: data})
    const {onUpdateItem} = this.props
    const res = await onUpdateItem(data)
    if (res.success && typeof onSuccess === 'function') onSuccess(res.data)
  }

  async componentWillMount() {
    this.props.getItem()
  }

  deleteStationType() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.stationType.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteStationType}>
          <Icon type="delete" />
          {translate('addon.delete')}
        </Button>
      </div>
    )
  }

  render() {
    const {dataSource} = this.state
    const {data, languageContents} = this.props
    const initialValues = Object.assign(data, {dataSource})
    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
        <Spin spinning={!this.props.isLoaded}>
          <Breadcrumb
            items={[
              'list',
              {
                id: 'edit',
                name: this.props.isLoaded && this.props.success
                  ? getContent(languageContents, {type: "StationType", itemId: data._id, field: 'name', value: data.name})
                  : null,
              },
            ]}
          />
          {this.props.isLoaded && (
            <StationTypeFrom
              isEdit
              isLoading={this.props.isUpdating}
              initialValues={initialValues}
              onSubmit={this.handleSubmit}
            />
          )}
        </Spin>
      </PageContainer>
    )
  }
}
