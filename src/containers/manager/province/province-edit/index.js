import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon, message } from 'antd'
import { autobind } from 'core-decorators'
import ProvinceApi from 'api/ProvinceApi'
import Clearfix from 'components/elements/clearfix'
import { getContent } from 'components/language/language-content'
import ROLE from 'constants/role'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import protectRole from 'hoc/protect-role'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Breadcrumb from '../breadcrumb'
import ProvinceForm from '../province-form'
import slug from '/constants/slug'

@protectRole(ROLE.PROVINCE.EDIT)
@createManagerDelete({
  apiDelete: ProvinceApi.deleteProvince,
})
@createManagerEdit({
  apiUpdate: ProvinceApi.updateProvince,
  apiGetByKey: ProvinceApi.getProviceByID,
})
@connect(state => ({
  languageContents: state.language.languageContents,
}))
@autobind
export default class ProvinceEdit extends React.PureComponent {
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
    const res = this.props.onUpdateItem(data)
    if(res.success && typeof onSuccess === 'function') onSuccess() 
    this.setState({
      dataSource: data,
    })
    return res
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    await this.props.getItem()
    if (!this.props.success) {
      message.error(this.props.lang.t('addon.error'))
      this.props.history.push(slug.province.list)
    }
  }

  cleanData() {
    let data = {
      ...this.props.data,
    }
    return data
  }

  deleteProvince() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.stationAuto.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteProvince}>
          <Icon type="delete" />
          Delete
        </Button>
      </div>
    )
  }

  render() {
    const { data, languageContents } = this.props
    const {dataSource} = this.props
    const initialValues = Object.assign(data, dataSource)

    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
        <Clearfix height={16} />
        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name:
                this.props.isLoaded && this.props.success
                  ? getContent(languageContents, {
                      type: 'Province',
                      itemId: data._id,
                      field: 'name',
                      value: data.name,
                    })
                  : null,
            },
          ]}
        />
        {this.props.isLoaded && this.props.success && (
          <ProvinceForm
            isLoading={this.props.isUpdating}
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
            isEdit={true}
          />
        )}
      </PageContainer>
    )
  }
}
