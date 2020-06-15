import React from 'react'
// import PropTypes from "prop-types";
// import styled from "styled-components";
import { message, Form, Spin, Collapse } from 'antd'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import { getConfigWqiParams, postConfigWqiParams } from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import NhomI from './nhomI'
import NhomII from './nhomII'
import NhomIII from './nhomIII'
import NhomIV from './nhomIV'
import NhomV from './nhomV'

const { Panel } = Collapse

const i18n = {
  submit: translate('addon.save'),
  warning: translate('addon.warning'),
  refresh: translate('addon.refresh'),
  cancel: translate('addon.cancel'),
  updateSuccess: translate('addon.onSave.update.success'),
  updateError: translate('addon.onSave.update.error'),

  add: translate('wqiConfigCalculation.add'),
}

@Form.create({})
export default class TabGiaTri extends React.Component {
  state = {
    isLoaded: false,
    configGroupI: [],
    configGroupII: [],
    configGroupIII: [],
    configGroupIV: [],
    configGroupV: [],
  }

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true })
        console.log('Received values of form: ', values)
        try {
          let transformData = values.payload
          const response = await postConfigWqiParams(this.props.code, transformData)
          if (response.success) {
            message.success(i18n.updateSuccess)
          }
        } finally {
          this.setState({ isSubmit: false })
        }
      }
    })
  }

  async componentDidMount() {
    const response = await getConfigWqiParams(this.props.code)
    if (response.success) {
      console.log('response', response)
      const config = _.get(response, 'data.value', [])
      this.setState({
        isLoaded: true,
        configGroupI: config.filter(item => item && item.group === 'groupI'),
        configGroupII: config.filter(item => item && item.group === 'groupII'),
        configGroupIII: config.filter(
          item => item && item.group === 'groupIII'
        ),
        configGroupIV: config.filter(item => item && item.group === 'groupIV'),
        configGroupV: config.filter(item => item && item.group === 'groupV'),
      })
    }
  }

  render() {
    if (!this.state.isLoaded)
      return (
        <Spin spinning>
          <div style={{ height: 400 }} />
        </Spin>
      )
    return (
      <div>
        <Clearfix height={16} />
        <div>
          <Collapse defaultActiveKey={['I']}>
            <Panel header="Nhóm I" key="I">
              <NhomI configMeasure={this.state.configGroupI} />
            </Panel>
            <Panel header="Nhóm II" key="II">
              <NhomII configMeasure={this.state.configGroupII} />
            </Panel>
            <Panel header="Nhóm III" key="III">
              <NhomIII configMeasure={this.state.configGroupIII} />
            </Panel>
            <Panel header="Nhóm IV" key="IV">
              <NhomIV configMeasure={this.state.configGroupIV} />
            </Panel>
            <Panel header="Nhóm V" key="V">
              <NhomV configMeasure={this.state.configGroupV} />
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}
