import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import CategoryApi from 'api/CategoryApi'
import PropTypes from 'prop-types'
import MeasuringForm from '../measuring-form'
import Breadcrumb from '../breadcrumb'
import slug from 'constants/slug'
import { message } from 'antd'
import createManagerCreate from 'hoc/manager-create'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { Clearfix } from 'components/elements'
import { connect } from 'react-redux'
import { createMeasure } from 'redux/actions/globalAction'

@protectRole(ROLE.MEASURING.CREATE)
@createManagerCreate({
  apiCreate: CategoryApi.createMeasuring,
})
@connect(null, dispatch => ({
  createMeasure: measure => dispatch(createMeasure(measure)),
}))
@createLanguage
@autobind
export default class MeasuringCreate extends React.PureComponent {
  static propTypes = {
    onCreateItem: PropTypes.func,
    lang: langPropTypes,
  }

  async handleSubmit(data) {
    let result
    const { createMeasure } = this.props
    await this.props.onCreateItem(data, res => {
      result = res
      if (res.success) {
        message.info(this.props.lang.t('addon.onSave.add.success'))
        createMeasure(res.data)
        this.props.history.push(slug.measuring.list)
      }
      //  else {
      // 	if (res.message === 'KEY_EXISTED')
      // 		message.error(
      // 			this.props.lang.t('measuringManager.create.keyExisted')
      // 		);
      // 	else message.error(this.props.lang.t('addon.onSave.add.error'));
      // }
    })
    return result
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <MeasuringForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
