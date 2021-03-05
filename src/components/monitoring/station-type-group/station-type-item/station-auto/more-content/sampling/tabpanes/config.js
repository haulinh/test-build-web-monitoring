import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Form, Radio, Collapse, Button } from 'antd'
import styled from 'styled-components'

import { translate as t } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'
import SqlConfig from './SqlConfig'
import ModBusConfig from './ModBusConfig'
import ExceededConfig from './ExceededConfig'

const i18n = {
  methodSampling: t('monitoring.moreContent.sampling.content.methodSampling'),
  totalBottles: t(
    'monitoring.moreContent.sampling.content.config.totalBottles'
  ),
  controlTagName: t(
    'monitoring.moreContent.sampling.content.config.controlTagName'
  ),
  timeToTakeOneBottle: t(
    'monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'
  ),
  save: t('monitoring.moreContent.sampling.content.config.save'),
  alertNull: t('error.nullValue'),
  alertSuccess: t('success.text'),
  alertError: t('error.text'),
  alertSaveConfigError: t('alert.error.monitoring.saveSampingConfig'),
  generalConfig: t(
    'monitoring.moreContent.sampling.content.config.generalConfig'
  ),
  exceededConfig: t(
    'monitoring.moreContent.sampling.content.config.exceededConfig'
  ),
}

const { Panel } = Collapse

const Wrapper = styled.div`
  padding: 14px
  > *:last-child {
    margin-top: 30px;
  }
`

class SamplingConfig extends Component {
  exceededConfigForm = null

  state = {
    isSaving: false,
    samplingProtocol: 'SQL',
  }

  handleSubmit = async () => {
    const { stationID, form, updateParentState } = this.props
    const exceededConfigForm = this.exceededConfigForm
      ? this.exceededConfigForm.getExceededConfigForm()
      : null

    try {
      const [configSampling, configExceeded] = await Promise.all([
        form.validateFields(),
        exceededConfigForm
          ? exceededConfigForm.validateFields()
          : Promise.resolve({}),
      ])

      const params = {
        configSampling,
        configExceeded,
      }
      this.setState({ isSaving: true })
      const results = await SamplingAPI.updateConfig(stationID, params)
      updateParentState({
        isConfig: true,
        configSampling: results.data.configSampling,
        configExceeded: configExceeded.config,
      })
    } catch (error) {}
    this.setState({ isSaving: false })
  }

  checkErr = name => {
    const { isFieldTouched, getFieldError } = this.props.form
    return isFieldTouched(name) && getFieldError(name)
  }

  handleChangeProtocol = e => {
    this.setState({ samplingProtocol: e.target.value })
  }

  renderGeneralConfig = () => (
    <div style={{ padding: '2em' }}>
      <Row style={{ marginBottom: '2em' }}>
        <span style={{ marginRight: '2em' }}>{i18n.methodSampling}</span>
        <Radio.Group
          disabled
          onChange={this.handleChangeProtocol}
          value={this.state.samplingProtocol}
        >
          {/* <Radio value={'MODBUS'}>ModBus</Radio> */}
          <Radio value={'SQL'}>Sql</Radio>
        </Radio.Group>
      </Row>

      {this.state.samplingProtocol === 'MODBUS' && (
        <ModBusConfig
          form={this.props.form}
          checkErr={this.checkErr}
          configSampling={this.props.configSampling}
          onSubmit={this.handleSubmit}
          isSaving={this.state.isSaving}
          stationId={this.props.stationID}
        />
      )}

      {this.state.samplingProtocol === 'SQL' && (
        <SqlConfig
          form={this.props.form}
          configSampling={this.props.configSampling}
          onSubmit={this.handleSubmit}
          isSaving={this.state.isSaving}
          stationId={this.props.stationID}
        />
      )}
    </div>
  )

  render() {
    const { isSaving } = this.state
    const { measuringList, configExceeded } = this.props
    console.log(measuringList, "--measuringList--")
    return (
      <Wrapper>
        <Collapse defaultActiveKey="general-config">
          <Panel key="general-config" header={i18n.generalConfig}>
            {this.renderGeneralConfig()}
          </Panel>
          <Panel key="exceeded-config" header={i18n.exceededConfig}>
            <ExceededConfig
              defaultValue={configExceeded}
              measuringList={measuringList}
              wrappedComponentRef={ref => (this.exceededConfigForm = ref)}
            />
          </Panel>
        </Collapse>
        <Button
          block
          type="primary"
          loading={isSaving}
          onClick={this.handleSubmit}
        >
          {i18n.save}
        </Button>
      </Wrapper>
    )
  }
}

SamplingConfig.propTypes = {
  configExceeded: PropTypes.object,
  stationID: PropTypes.string.isRequired,
  configSampling: PropTypes.object.isRequired,
  updateParentState: PropTypes.func.isRequired,
}

SamplingConfig.defaultProps = {
  configExceeded: {},
  configSampling: {
    totalBottles: 1,
    controlTagName: '',
    timeToTakeOneBottle: 1,
  },
}

export default Form.create()(SamplingConfig)
