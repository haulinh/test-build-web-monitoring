import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Table, Button, InputNumber, Modal, TimePicker, Collapse, Select  } from 'antd'
import styled from 'styled-components';
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, {translate} from 'hoc/create-lang'

const Panel = Collapse.Panel;
const Option = Select.Option;
const format = 'HH:mm';
const dataTime = [
  {
    key: 1,
    value: 'stationAutoManager.options.outOfRangeConfig.daily'
  },
  {
    key: 2,
    value: 'stationAutoManager.options.outOfRangeConfig.monday'
  },
  {
    key: 3,
    value: 'stationAutoManager.options.outOfRangeConfig.tuesday'
  },
  {
    key: 4,
    value: 'stationAutoManager.options.outOfRangeConfig.wednesday'
  },
  {
    key: 5,
    value: 'stationAutoManager.options.outOfRangeConfig.thursday'
  },
  {
    key: 6,
    value: 'stationAutoManager.options.outOfRangeConfig.friday'
  },
  {
    key: 7,
    value: 'stationAutoManager.options.outOfRangeConfig.saturday'
  },
  {
    key: 8,
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
      from: '',
      to: ''
    },
    dayList: [],
    isCustom: false
  }

  renderItemConfigRange = () => {
    const t = this.props.lang.t
    return (
      <div>
          <div class="row" style={{padding:4}}>
            <div class="col-md-4"><span> {t('stationAutoManager.options.outOfRangeConfig.timeConfig')} : </span></div>
            <div class="col-md-4">
              <TimePicker
                format={format}
                style={{ width: '100%' }} 
                placeholder={t('stationAutoManager.options.outOfRangeConfig.placeholderTimeFrom')}
                onChange={(time, timeString) => this.onchangeTime(time, timeString, 'from')}/>
            </div>
            <div class="col-md-4">
              <TimePicker
                format={format}
                style={{ width: '100%' }}
                placeholder={t('stationAutoManager.options.outOfRangeConfig.placeholderTimeTo')}
                onChange={(time, timeString) => this.onchangeTime(time, timeString, 'to')}/>
            </div>
          </div>
          <div style={{padding:4}}>
            <Collapse defaultActiveKey={['1']}>
              <Panel key='1' header={t('stationAutoManager.options.outOfRangeConfig.selectTile')}>
                <Select
                  mode="multiple"
                  value={this.state.dayList}
                  style={{ width: '100%' }}
                  placeholder={t('stationAutoManager.options.outOfRangeConfig.placeholderSelect')}
                  onChange={this.handleChangeDays}
                >
                {
                  _.map(dataTime, item =>  <Option value={item.key}>{t(item.value)}</Option>)
                }
                </Select>
              </Panel>
            </Collapse>
          </div>
      </div>
    )
  }

  handleChangeDays = dayList => {
    if (dayList.includes(1)){
      this.setState({ dayList: _.size(this.state.dayList) === 7 ? [] : _.map(_.slice(dataTime, 1, dataTime.length), 'key') });
    } else {
      this.setState({ dayList });
    }
  }

  onchangeTime = (time, timeString, key) => {
    _.update(this.state, `hours.${key}`, () => timeString)
  }

  handleSave = () => {
    if (_.isEmpty(_.get(this.state, 'hours.from'))) {
      // TODO: Thông báo chọn giờ
      return
    } else if (_.isEmpty(_.get(this.state, 'hours.to'))) {
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
          <Button key="back" onClick={this.props.handleRangeConfigCancel}>{this.props.lang.t('stationAutoManager.options.outOfRangeConfig.btnCancel')}</Button>,
          <Button key="submit" type="primary" onClick={this.handleSave}>
            {this.props.lang.t('stationAutoManager.options.outOfRangeConfig.btnSave')}
          </Button>,
        ]}
      >
        {this.renderItemConfigRange()}
    </Modal>
    )
  }
}
