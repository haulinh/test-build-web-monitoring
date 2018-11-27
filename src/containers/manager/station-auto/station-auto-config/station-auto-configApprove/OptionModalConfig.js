import React from 'react'
// import PropTypes from 'prop-types'
import {
  Form,
  Button,
  Modal,
  TimePicker,
  Collapse,
  Select,
  message
} from 'antd'
// import styled from 'styled-components';
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import moment from 'moment'

const Panel = Collapse.Panel
const Option = Select.Option
const format = 'HH:mm'
const dataTime = [
  {
    key: 7,
    value: 'stationAutoManager.options.outOfRangeConfig.daily'
  },
  {
    key: 1,
    value: 'stationAutoManager.options.outOfRangeConfig.monday'
  },
  {
    key: 2,
    value: 'stationAutoManager.options.outOfRangeConfig.tuesday'
  },
  {
    key: 3,
    value: 'stationAutoManager.options.outOfRangeConfig.wednesday'
  },
  {
    key: 4,
    value: 'stationAutoManager.options.outOfRangeConfig.thursday'
  },
  {
    key: 5,
    value: 'stationAutoManager.options.outOfRangeConfig.friday'
  },
  {
    key: 6,
    value: 'stationAutoManager.options.outOfRangeConfig.saturday'
  },
  {
    key: 0,
    value: 'stationAutoManager.options.outOfRangeConfig.sunday'
  }
]
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class OptionModalConfig extends React.Component {
  state = {
    hours: {
      from: _.get(this.props.dataEditCalibration, 'hours.from', ''),
      to: _.get(this.props.dataEditCalibration, 'hours.to', '')
    },
    dayList: _.get(this.props.dataEditCalibration, 'dayList', [8]),
    isCustom: false
  }

  renderItemConfigRange = () => {
    const t = this.props.lang.t
    let data = this.props.dataEditCalibration
    return (
      <div>
        <div class="row" style={{ padding: 4 }}>
          <div class="col-md-4">
            <span>
              {' '}
              {t(
                'stationAutoManager.options.outOfRangeConfig.timeConfig'
              )} :{' '}
            </span>
          </div>
          <div class="col-md-4">
            <TimePicker
              format={format}
              style={{ width: '100%' }}
              placeholder={t(
                'stationAutoManager.options.outOfRangeConfig.placeholderTimeFrom'
              )}
              defaultValue={moment(_.get(data, 'hours.from', '00:00'), format)}
              onChange={(time, timeString) =>
                this.onchangeTime(time, timeString, 'from')
              }
            />
          </div>
          <div class="col-md-4">
            <TimePicker
              format={format}
              style={{ width: '100%' }}
              placeholder={t(
                'stationAutoManager.options.outOfRangeConfig.placeholderTimeTo'
              )}
              defaultValue={moment(_.get(data, 'hours.to', '23:59'), format)}
              onChange={(time, timeString) =>
                this.onchangeTime(time, timeString, 'to')
              }
            />
          </div>
        </div>
        <div style={{ padding: 4 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              key="1"
              header={t(
                'stationAutoManager.options.outOfRangeConfig.selectTile'
              )}
            >
              <Select
                mode="multiple"
                value={this.state.dayList}
                style={{ width: '100%' }}
                placeholder={t(
                  'stationAutoManager.options.outOfRangeConfig.placeholderSelect'
                )}
                onChange={this.handleChangeDays}
              >
                {_.map(dataTime, item => (
                  <Option key={item.key} value={item.key}>
                    {translate(item.value)}
                  </Option>
                ))}
              </Select>
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }

  handleChangeDays = dayList => {
    if (dayList.includes(7)) {
      this.setState({
        dayList:
          _.size(this.state.dayList) === 7
            ? []
            : _.map(_.slice(dataTime, 1, dataTime.length), 'key')
      })
    } else {
      this.setState({ dayList })
    }
  }

  onchangeTime = (time, timeString, key) => {
    _.update(this.state, `hours.${key}`, () => timeString)
  }

  handleSave = () => {
    //this.setState({hours:_.get(this.props.dataEditCalibration,'hours',{})})
    if (_.isEmpty(_.get(this.state, 'hours.from'))) {
      message.warning(
        translate('stationAutoManager.options.outOfRangeConfig.warning')
      )
      // TODO: Thông báo chọn giờ
      return
    } else if (_.isEmpty(_.get(this.state, 'hours.to'))) {
      message.warning(
        translate('stationAutoManager.options.outOfRangeConfig.warning')
      )
      // TODO: Thông báo chọn giờ
      return
    }
    this.props.handleRangeConfigSave(this.state)
  }

  render() {
    return (
      <Modal
        visible={this.props.showModalConfig}
        title={translate('stationAutoManager.options.calibration.title')}
        onOk={this.props.handleSave}
        onCancel={this.props.handleRangeConfigCancel}
        footer={[
          <Button key="back" onClick={this.props.handleRangeConfigCancel}>
            {this.props.lang.t(
              'stationAutoManager.options.outOfRangeConfig.btnCancel'
            )}
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSave}>
            {this.props.lang.t(
              'stationAutoManager.options.outOfRangeConfig.btnSave'
            )}
          </Button>
        ]}
      >
        {this.renderItemConfigRange()}
      </Modal>
    )
  }
}
