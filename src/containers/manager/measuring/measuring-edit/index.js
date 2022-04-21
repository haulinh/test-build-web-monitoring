import { Button, Icon } from 'antd'
import CategoryApi from 'api/CategoryApi'
import { withLanguageContent } from 'components/language/language-content'
import ROLE from 'constants/role'
import { autobind } from 'core-decorators'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import createManagerDelete from 'hoc/manager-delete'
import createManagerEdit from 'hoc/manager-edit'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { updateMeasure } from 'redux/actions/globalAction'
import Breadcrumb from '../breadcrumb'
import MeasuringForm from '../measuring-form'
import slug from '/constants/slug'

@protectRole(ROLE.MEASURING.EDIT)
@withLanguageContent
@connect(null, dispatch => ({
  updateMeasure: measure => dispatch(updateMeasure(measure)),
}))
@createManagerDelete({
  apiDelete: CategoryApi.deleteMeasuring,
})
@createManagerEdit({
  apiUpdate: CategoryApi.updateMeasuring,
  apiGetByKey: CategoryApi.getMeasuring,
})
@createLanguage
@autobind
export default class MeasuringEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
    lang: langPropTypes,
  }
  state = {
    dataSource: null,
  }

  async handleSubmit(data) {
    const { updateMeasure } = this.props
    this.setState({
      dataSource: data,
    })
    this.props.onUpdateItem(data)
    updateMeasure(data)
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    //const key = this.props.match.params.key
    this.props.getItem()
  }

  cleanData() {
    return {
      ...this.props.data,
    }
  }

  // Su kien xoa measuring
  deleteMeasuring() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.measuring.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteMeasuring}>
          <Icon type="delete" /> {this.props.lang.t('addon.delete')}
        </Button>
      </div>
    )
  }

  render() {
    const { data, translateContent } = this.props

    const measureName = translateContent({
      type: 'Measure',
      itemKey: data.key,
      value: data.name,
    })

    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name: this.props.isLoaded ? measureName : null,
            },
          ]}
        />
        {this.props.isLoaded && (
          <MeasuringForm
            initialValues={
              this.state.dataSource ? this.state.dataSource : this.cleanData()
            }
            onSubmit={this.handleSubmit}
            isEdit={true}
          />
        )}
      </PageContainer>
    )
  }
}
