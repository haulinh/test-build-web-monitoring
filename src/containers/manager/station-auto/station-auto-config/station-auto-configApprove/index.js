import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Table, Button, InputNumber, Modal, TimePicker, Collapse, Select, Icon  } from 'antd'
import styled from 'styled-components'
import * as _ from 'lodash'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import moment from 'moment';

const FormItem = Form.Item
const Panel = Collapse.Panel;
const Option = Select.Option;
const repeatAuto = [
<Option key='DAILY'>{translate('stationAutoManager.options.outOfRangeConfig.daily')}</Option>,
<Option key='MONDAY'>{translate('stationAutoManager.options.outOfRangeConfig.monday')}</Option>,
<Option key='TUESDAY'>{translate('stationAutoManager.options.outOfRangeConfig.tuesday')}</Option>,
<Option key='WEDNESDAY'>{translate('stationAutoManager.options.outOfRangeConfig.wednesday')}</Option>,
<Option key='THURSDAY'>{translate('stationAutoManager.options.outOfRangeConfig.thursday')}</Option>,
<Option key='FIREDAY'>{translate('stationAutoManager.options.outOfRangeConfig.friday')}</Option>,
<Option key='SATURDAY'>{translate('stationAutoManager.options.outOfRangeConfig.saturday')}</Option>,
<Option key='SUNDAY'>{translate('stationAutoManager.options.outOfRangeConfig.sunday')}</Option>
]



const OutOfRangeView = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`
const format = 'HH:mm';
@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoConfigApprove extends React.Component {
  static propTypes = {
    onApproveSave: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    measuringListSource: PropTypes.array,
    options: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      allowed: _.get(props, 'options.approve.allowed', true),
      listRuleChange: _.get(props, 'options.approve.rules', {}),
      valueRules: _.get(this.props, 'options.approve.valueRules', {}),
      showModalConfig: false,
      dataConfigRange: {},
      keyConfigRange:'',
      keyEditConfigRange:'',
      isEditConfigRange: false,
      dataEditConfig:{}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.allowed, this.props.allowed) ||
      !_.isEqual(nextProps.valueRules, this.props.valueRules) ||
      !_.isEqual(nextProps.listRuleChange, this.props.listRuleChange) 
    ) {
      this.setState({
        allowed: _.get(nextProps, 'options.approve.allowed', true),
        listRuleChange: _.get(nextProps, 'options.approve.rules', {}),
        valueRules: _.get(this.props, 'options.approve.valueRules', {})
      })
    }
  }

  onChangeCheckboxAuto = event => {
    this.setState({ allowed: event.target.checked })
  }

  onChangeCheckbox = e => {
    const { checked, data, name } = e.target
    const listRuleChange = this.state.listRuleChange
    let valueRules = this.state.valueRules
    let keyConfigRange = this.state.keyConfigRange
    if (checked) {
      listRuleChange[data.key] = _.union(
        _.get(listRuleChange, [data.key], []),
        [name]
      )
      if (_.isEqual(name, 'OUT_RANGE')) {
        keyConfigRange = data.key
        this.setState({showModalConfig: true})
      }
    } else {
      listRuleChange[data.key] = _.filter(
        _.get(listRuleChange, [data.key], []),
        item => !_.isEqual(item, name)
      )

      if (_.isEqual(name, 'OUT_RANGE')) {
        _.update(valueRules, data.key, () => undefined)
      }
    }

    this.setState({ listRuleChange, valueRules, keyConfigRange })
  }

  isItemChecked = (key, value) => {
    return _.includes(_.get(this.state, ['listRuleChange', key], []), value)
  }

  handleRangeConfigCancel = () => {
    this.setState({showModalConfig: false, isEditConfigRange:false, dataEditConfig:{}})
  }

  handleRangeConfigSave = () => {
    let valueRules = this.state.valueRules
    this.setState({showModalConfig: false, isEditConfigRange: false, dataEditConfig:{}})
    _.update(valueRules, this.state.keyConfigRange, () => {
      return this.state.dataConfigRange
    })
  }
  renderItemConfigRange = () => {
    let dataConfig = {}
    let key = ''
    if(this.state.isEditConfigRange){
      dataConfig = _.get(this.state.valueRules, `${this.state.keyEditConfigRange}`,{})
      key += `${this.state.keyEditConfigRange}`
    } else {
      dataConfig = {}
    }
    console.log(dataConfig)
    return (
      <div>
          <div class="row" style={{padding:5}}>
            <div class="col-md-2"><span> {translate('stationAutoManager.options.outOfRangeConfig.minRange')} : </span></div>
            <div class="col-md-4"><InputNumber defaultValue={_.get(dataConfig,'minRange', '')} max={100000} style={{ width: '100%' }} onChange={this.onchangeMinRange}/></div>
            <div class="col-md-2"><span>{translate('stationAutoManager.options.outOfRangeConfig.maxRange')} : </span></div>
            <div class="col-md-4"><InputNumber defaultValue={_.get(dataConfig,'maxRange', '')} max={100000} style={{ width: '100%' }} onChange={this.onchangeMaxRange}/></div>
          </div>
          <div class="row" style={{padding:5}}>
            <div class="col-md-2"><span> {translate('stationAutoManager.options.outOfRangeConfig.timeFrom')} : </span></div>
            <div class="col-md-4"><TimePicker defaultValue={moment(_.get(dataConfig,'from','00:00'), format)} format={format} style={{ width: '100%' }} placeholder={translate('stationAutoManager.options.outOfRangeConfig.placeholderTimeFrom')} onChange={this.onchangeTimeFrom}/></div>
            <div class="col-md-2"><span> {translate('stationAutoManager.options.outOfRangeConfig.timeTo')} : </span></div>
            <div class="col-md-4"><TimePicker defaultValue={moment(_.get(dataConfig,'to','23:59'), format)} format={format} style={{ width: '100%' }} placeholder={translate('stationAutoManager.options.outOfRangeConfig.placeholderTimeTo')} onChange={this.onchangeTimeTo}/></div>
          </div>
          <div style={{padding:5}}>
            <Collapse defaultActiveKey={['1']}>
              <Panel header={translate('stationAutoManager.options.outOfRangeConfig.selectTile')} key="1">
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder={translate('stationAutoManager.options.outOfRangeConfig.placeholderSelect')}
                  onChange={this.handleChangeSelect}
                  defaultValue={_.get(dataConfig,'autoRepeat',[])}
                >
                  {repeatAuto}
                </Select>
              </Panel>
            </Collapse>
          </div>
          <div style={{textAlign:'center', color:'red'}}>
            <strong>-- {key} --</strong>
          </div>
      </div>
    )
  }

  onchangeMinRange(value){
    let dataConfigRange = this.state.dataConfigRange
    dataConfigRange = {...dataConfigRange, minRange: value}
    this.setState({dataConfigRange})
  }
  onchangeMaxRange(value){
    let dataConfigRange = this.state.dataConfigRange
    dataConfigRange = {...dataConfigRange, maxRange: value}
    this.setState({dataConfigRange})
  }
  onchangeTimeFrom(time, timeString){
    let dataConfigRange = this.state.dataConfigRange
    dataConfigRange = {...dataConfigRange, from: timeString}
    this.setState({dataConfigRange})
  }
  onchangeTimeTo(time, timeString){
    let dataConfigRange = this.state.dataConfigRange
    dataConfigRange = {...dataConfigRange, to: timeString}
    this.setState({dataConfigRange})
  }
  handleChangeSelect(value){
    let dataConfigRange = this.state.dataConfigRange
    dataConfigRange = {...dataConfigRange, autoRepeat: value}
    this.setState({dataConfigRange})
  }

  returnInfoRangeConfig = (key) => {
     const info = _.get(this.state.valueRules,`${key}`, {})
     let textInfo = ''
     if(!_.isEmpty(info) && !_.isEmpty(info.from) && !_.isEmpty(info.to))
     {
      textInfo += `(${translate('stationAutoManager.options.outOfRangeConfig.timeFrom')}: ${info.from} - ${translate('stationAutoManager.options.outOfRangeConfig.timeTo')}: ${info.to}...)`
     } else {
      textInfo += '...'
     }
     return textInfo
  }

  handleEdit = (key) => {
    this.setState({showModalConfig: true, isEditConfigRange:true, dataEditConfig:_.get(this.state.valueRules,`${key}`,{}), keyEditConfigRange:key})
  }


  getColums = () => {
    return [
      {
        title: this.props.lang.t(
          'stationAutoManager.options.allowApprove.parameters'
        ),
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        render: value => value
      },
      {
        title: this.props.lang.t(
          'stationAutoManager.options.allowApprove.rules'
        ),
        children: [
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.zero'
            ),
            dataIndex: '',
            key: 'ZERO',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                name="ZERO"
                data={row}
                checked={this.isItemChecked(row.key, 'ZERO')}
                onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.negative'
            ),
            dataIndex: '',
            key: 'NEGATIVE',
            align: 'center',
            width: '18%',
            render: (value, row) => (
            <div>
              <Checkbox
                checked={this.isItemChecked(row.key, 'NEGATIVE')}
                name="NEGATIVE"
                data={row}
                onChange={this.onChangeCheckbox}
              />
            </div>  
            )
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.outOfRange'
            ),
            dataIndex: '',
            key: 'OUT_RANGE',
            align: 'center',
            width: '28%',
            render: (value, row) => {
              const checkedOut = this.isItemChecked(row.key, 'OUT_RANGE')
              return (
                <OutOfRangeView>
                   <Checkbox
                    checked={checkedOut}
                    name="OUT_RANGE"
                    data={row}
                    onChange={this.onChangeCheckbox}
                  />
                  {checkedOut && (
                    <div>
                      <span style={{color:'blue', paddingLeft:'15px'}}>{this.returnInfoRangeConfig(row.key)}</span>
                      <span onClick={() => this.handleEdit(row.key)}><Icon type="edit" theme="outlined" style={{paddingLeft:'15px' ,color: 'blue'}}/>{' '}</span>
                    </div>
                    
                  )}
                </OutOfRangeView>
              )
            }
          },
          {
            title: this.props.lang.t(
              'stationAutoManager.options.allowApprove.deviceStatus'
            ),
            dataIndex: '',
            key: 'DEVICE_STATUS',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                checked={this.isItemChecked(row.key, 'DEVICE_STATUS')}
                name="DEVICE_STATUS"
                data={row}
                onChange={this.onChangeCheckbox}
              />
            )
          }
        ]
      }
    ]
  }

  onSave = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onApproveSave({
          allowed: this.state.allowed,
          rules: this.state.listRuleChange,
          valueRules: this.state.valueRules
        })
      }
    })
  }

  render() {
    const { showModalConfig} = this.state;
    return (
      <div>
        <Table
          bordered
          title={() => (
            <Checkbox
              checked={this.state.allowed}
              name="allowed"
              onChange={this.onChangeCheckboxAuto}
            >
              {this.props.lang.t(
                'stationAutoManager.options.allowApprove.label'
              )}
            </Checkbox>
          )}
          footer={() =>
            this.props.lang.t('stationAutoManager.options.allowApprove.note')
          }
          rowKey="key"
          size="small"
          columns={this.getColums(this.props.form.getFieldDecorator)}
          dataSource={this.props.measuringListSource}
        />
        <Button
          onClick={this.onSave}
          style={{ width: '100%' }}
          type="primary"
          htmlType="button"
        >
          {this.props.lang.t('addon.save')}
        </Button>
        {this.state.showModalConfig &&(
          <Modal
              visible={showModalConfig}
              title={translate('stationAutoManager.options.outOfRangeConfig.title')}
              onOk={this.handleRangeConfigSave}
              onCancel={this.handleRangeConfigCancel}
              footer={[
                <Button key="back" onClick={this.handleRangeConfigCancel}>{translate('stationAutoManager.options.outOfRangeConfig.btnCancel')}</Button>,
                <Button key="submit" type="primary" onClick={this.handleRangeConfigSave}>
                  {translate('stationAutoManager.options.outOfRangeConfig.btnSave')}
                </Button>,
                  ]}
          >
          {this.renderItemConfigRange()}
          </Modal> 
        )}
        {/* <Modal
            visible={showModalConfig}
            title={translate('stationAutoManager.options.outOfRangeConfig.title')}
            onOk={this.handleRangeConfigSave}
            onCancel={this.handleRangeConfigCancel}
            footer={[
              <Button key="back" onClick={this.handleRangeConfigCancel}>{translate('stationAutoManager.options.outOfRangeConfig.btnCancel')}</Button>,
              <Button key="submit" type="primary" onClick={this.handleRangeConfigSave}>
                {translate('stationAutoManager.options.outOfRangeConfig.btnSave')}
              </Button>,
            ]}
        >
        {this.renderItemConfigRange()}
        </Modal>  */}
      </div>
    )
  }
}

