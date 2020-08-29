/* libs import */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Row, Form, Radio } from 'antd'
import swal from 'sweetalert2'
/* user import */
import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'
import SqlConfig from './SqlConfig'
import ModBusConfig from './ModBusConfig'

const i18n = {
  totalBottles: translate(
    'monitoring.moreContent.sampling.content.config.totalBottles'
  ),
  controlTagName: translate(
    'monitoring.moreContent.sampling.content.config.controlTagName'
  ),
  timeToTakeOneBottle: translate(
    'monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'
  ),
  save: translate('monitoring.moreContent.sampling.content.config.save'),
  alertNull: translate('error.nullValue'),
  alertSuccess: translate('success.text'),
  alertError: translate('error.text'),
  alertSaveConfigError: translate('alert.error.monitoring.saveSampingConfig'),
}

@Form.create()
@withRouter
export default class SamplingConfig extends React.Component {
  static propTypes = {
    stationID: PropTypes.string.isRequired,
    configSampling: PropTypes.object.isRequired,
    configSamplingSchedule: PropTypes.object,
    updateParentState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    stationID: '',
    configSampling: {
      totalBottles: 1,
      controlTagName: '',
      timeToTakeOneBottle: 1,
    },
  }

  state = {
    isSaving: false,
    samplingProtocol: 'SQL',
  }

  handleSave = () => {
    this.setState({ isSaving: true })
    setTimeout(() => {
      this.setState({ isSaving: false })
    }, 1000)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ isSaving: true })
    const { stationID } = this.props

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSaveConfigError, type: 'error' })
        return
      }

      try {
        const res = await SamplingAPI.updateConfig(stationID, {
          configSampling: values,
        })
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSuccess, type: 'success' })
        this.props.updateParentState({
          isConfig: true,
          configSampling: res.data.configSampling,
        })
      } catch (error) {
        console.error(
          error,
          '========Lỗi handleSubmit SamplingConfig========== '
        )
        this.setState({ isSaving: false })
        swal({ title: '', type: 'error' })
      }
    })
  }

  checkErr = name => {
    const { isFieldTouched, getFieldError } = this.props.form
    return isFieldTouched(name) && getFieldError(name)
  }

  handleChangeProtocol = e => {
    this.setState({ samplingProtocol: e.target.value })
  }

  render() {
    return (
      <div style={{ padding: '2em' }}>
        <Row style={{ marginBottom: '2em' }}>
          <span style={{ marginRight: '2em' }}>Giao thức lấy mẫu</span>
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
            checkErr={this.checkErr}
            configSampling={this.props.configSampling}
            onSubmit={this.handleSubmit}
            isSaving={this.state.isSaving}
            stationId={this.props.stationID}
          />
        )}

        {this.state.samplingProtocol === 'SQL' && (
          <SqlConfig
            checkErr={this.checkErr}
            configSampling={this.props.configSampling}
            onSubmit={this.handleSubmit}
            isSaving={this.state.isSaving}
            stationId={this.props.stationID}
          />
        )}
      </div>
    )
  }
}
