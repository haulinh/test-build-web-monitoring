import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon, Spin } from 'antd'
import { autobind } from 'core-decorators'
import StationAutoApi from 'api/StationAuto'
import Clearfix from 'components/elements/clearfix'
import {getContent} from 'components/language/language-content'
import StationAutoForm from '../station-auto-form'
import slug from '/constants/slug'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import { message } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import {connect} from 'react-redux'

@protectRole(ROLE.STATION_AUTO.EDIT)
@createManagerDelete({
  apiDelete: StationAutoApi.deleteStationAuto,
})
@createManagerEdit({
  apiUpdate: StationAutoApi.updateStationAuto,
  apiGetByKey: StationAutoApi.getStationAuto,
})
@connect(
  state => ({
    languageContents: state.language.languageContents
  }))
@autobind
export default class StationAutoEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }

  async handleSubmit(data, onSuccess) {
    const {onUpdateItem} = this.props
    const res = await onUpdateItem(data)

    if(res.success && typeof onSuccess === 'function') onSuccess(res.data)
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    await this.props.getItem()
    if (!this.props.success) {
      message.error(this.props.lang.t('addon.error'))
      this.props.history.push(slug.stationAuto.list)
    }
  }

  cleanData() {
    let data = {
      ...this.props.data,
    }

    data.measuringList = this.props.data.measuringList || []
    return data
  }

  deleteStationAuto() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.stationAuto.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteStationAuto}>
          <Icon type="delete" />
          Delete
        </Button>
      </div>
    )
  }

  render() {
    const {location, languageContents} = this.props
    const {search: otherForm} = location

    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>

        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name: this.props.isLoaded && this.props.success
                  ? getContent(languageContents, {type: "Station", itemId: this.cleanData()._id, field: 'name', value: this.cleanData().name})
                  : null,
            },
          ]}
        />
        <Clearfix height={16} />
        <Spin style={{width: '100%'}} spinning={!this.props.isLoaded}>
          {this.props.isLoaded && this.props.success && (
            <StationAutoForm
              isLoading={this.props.isUpdating}
              initialValues={this.cleanData()}
              onSubmit={this.handleSubmit}
              isEdit={true}
              otherForm={otherForm}
            />
          )}
        </Spin>
      </PageContainer>
    )
  }
}
