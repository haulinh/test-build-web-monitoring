/* libs import */

/* 
  TODO  tìm "MARK -- MOCK DATA" thay thế bằng dữ liệu thật
*/

import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import swal from 'sweetalert2';
import {
  Row, Col,
  Form, InputNumber, Button,Radio, Input,
  TimePicker, DatePicker, message, Modal,
} from 'antd';
import moment from 'moment';
/* user import */
import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'

const i18n = {
  /*  */
  totalBottles        : translate('monitoring.moreContent.sampling.content.totalBottles'),
  sampledBottles      : translate('monitoring.moreContent.sampling.content.sampledBottles'),
  /* sampling mode */
  typeOfSampling      : translate('monitoring.moreContent.sampling.content.typeOfSampling'),
  immediatelySampling : translate('monitoring.moreContent.sampling.content.immediatelySampling'),
  scheduleSampling    : translate('monitoring.moreContent.sampling.content.scheduleSampling'),
  bottlesNeedToTake   : translate('monitoring.moreContent.sampling.content.bottlesNeedToTake'),
  timeStartSampling   : translate('monitoring.moreContent.sampling.content.timeStartSampling'),
  frequency           : translate('monitoring.moreContent.sampling.content.frequency'),
  dateStartSampling   : translate('monitoring.moreContent.sampling.content.dateStartSampling'),
  /* button lay mau thu cong */
  takeSample          : translate('monitoring.moreContent.sampling.content.takeSample'),
  commandSent         : translate('monitoring.moreContent.sampling.content.commandSent'),
  takingSample        : translate('monitoring.moreContent.sampling.content.takingSample'),
  /* button lay mau tu dong */
  active              : translate('monitoring.moreContent.sampling.content.active'),
  actived             : translate('monitoring.moreContent.sampling.content.actived'),
  /* button lay mau vuot nguong */
  activeOverRange     : translate('monitoring.moreContent.sampling.content.activeOverRange'),
  activedOverRange    : translate('monitoring.moreContent.sampling.content.activedOverRange'),
  /* alerts */
  alertNull               : translate('error.nullValue'),
  alertSuccess            : translate('success.text'),
  alertError              : translate('error.text'),
  alertModalResetTitle    : translate('error.monitoring.sampling.resetTitle'),
  alertModalResetSubtitle : translate('error.monitoring.sampling.resetSubtitle'),
  alertErrorUpdateScheduleSubtitle : translate('error.monitoring.sampling.updateScheduleSubtitle'),
  alertErrorTakeSampling : translate('error.monitoring.sampling.takeSampling'),
  /*  */
  modalConfirm: translate('modal.confirm.title'),
  cancelConfigSchedule: translate('modal.confirm.monitoring.sampling.cancelSchedule')
}     

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item
const ModalConfirm = Modal.confirm;

const STATUS_COLOR = {
  READY: '',
  COMMANDED: '',
  SAMPLING: {
    backgroundColor: 'orange',
    borderColor: 'orange'
  },
  ACTIVED: {
    backgroundColor: 'orange',
    borderColor: 'orange'
  },
}

const SAMPLING_TYPE = {
  MANUAL: 'MANUAL',
  AUTO: 'AUTO'
}

function isFormError(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string,
    isScheduled: PropTypes.bool,
    configSampling: PropTypes.object,
    configSamplingSchedule: PropTypes.object
  }


  static defaultProps = {
    stationID: '',
    isScheduled: false,
    configSampling: {
      totalBottles: 0,
      sampledBottles: 0,
      controlTagName: '',
      timeToTakeOneBottle: 0,
      status: ''
    },
    configSamplingSchedule: {
      numberBottles: 3,
      frequency: 30,
      dateTimeStart: moment()
    }
  }


  state = {
    isReseting: false,
    samplingType: SAMPLING_TYPE.MANUAL,                       /* manual || auto */
    // mock states
    isActivedOverRange: false,
    isScheduleUpdating: false
  }


  constructor(props) {
    super(props);
    /* viết kiểu này để fix lỗi _this10 do babel k hỗ trợ async/await */
    this.resetSampledBottle = this.resetSampledBottle.bind(this)
    this.handleSubmitFormReset = this.handleSubmitFormReset.bind(this)
    this.handleClickActive = this.handleClickActive.bind(this)
    this.cancelConfigSchedule = this.cancelConfigSchedule.bind(this)

    this.state.samplingType = this.props.isScheduled? SAMPLING_TYPE.AUTO: SAMPLING_TYPE.MANUAL
  }

  async resetSampledBottle(e) {
    let {stationID} = this.props
    let res = await SamplingAPI.resetSampledBottle(stationID)
    if (res.success) {
      let {sampledBottles} = res.data.configSampling
      this.props.updateParentState({
        configSampling: {
          ...this.props.configSampling,
          sampledBottles
        }
      })
    }
    return res;
  }


  async handleSubmitFormReset(e) {
    // e.preventDefault()
    let me = this
    Modal.confirm({
      title: i18n.alertModalResetTitle,
      content: i18n.alertModalResetSubtitle,
      async onOk() {
        return await me.resetSampledBottle(e)
      },
      onCancel() {},
    });
  }
  /* TODO  LATER */
  handleSubmitFormSampleAuto = (e) => {
    e.preventDefault()
  }


  handleSamplingTypeChange = (e) => {
    console.log(e.target.value)
    this.setState({samplingType: e.target.value})
  }


  takeSample = () => {
    const {STATUS_SAMPLING} = this.props
    this.props.updateParentState({
      configSampling: {
        ...this.props.configSampling,
        status: STATUS_SAMPLING.COMMANDED
      }
    })
    const {stationID, configSampling} = this.props;
    return SamplingAPI.takeSampling(stationID, {configSampling})
  }  


  handleClickSampling = () => {
    const {STATUS_SAMPLING} = this.props
    const {status} = this.props.configSampling;
    if (status == STATUS_SAMPLING.READY) {
      return this.takeSample()
        .then(res => {
          if (res.success) {
            const {status} = res.data.configSampling;
            this.props.updateParentState({
              configSampling: {
                ...this.props.configSampling,
                status: status
              }
            })
          }
        })
        .catch(err => {
          const {name, message} = err.response.data.error
          /* MARK  -- @Thao: backend trả về code để frontend biết mà translate */
          swal({
            title: i18n.alertError,
            html: i18n.alertErrorTakeSampling,
            width: 600,
            type: 'error'})
          this.props.updateParentState({
            configSampling: {
              ...this.props.configSampling,
              status: STATUS_SAMPLING.READY
            }
          })
        })
    }
  }

  async cancelConfigSchedule() {
    const {stationID} = this.props
    let me = this
    Modal.confirm({
      title: i18n.modalConfirm,
      content: i18n.cancelConfigSchedule,
      async onOk() {
        const res = await SamplingAPI.cancelConfigSchedule(stationID)
        if (res.data.configSamplingSchedule === null) {
          me.props.updateParentState({
            isScheduled: false
          })
        }
        return
      },
      onCancel() {},
    });
  }

  async handleClickActive() {
    this.props.updateParentState({
      isScheduled: true
    })
    const {stationID, isScheduled} = this.props;
    const {getFieldValue} = this.props.form;

    if (!isScheduled) {
      let timeStartSampling = getFieldValue('timeStartSampling').format('HH:mm')
      let dateStartSampling = getFieldValue('dateStartSampling').format('DD-MM-YYYY')
      const body = {
        "configSamplingSchedule": {
          "numberBottles": getFieldValue('bottlesNeedToTake'),
          "frequency": getFieldValue('frequency'),
          "dateTimeStart": moment(`${dateStartSampling} ${timeStartSampling}`,'DD-MM-YYYY HH:mm').toDate()
        }
      }
      this.setState({isScheduleUpdating: true})
      console.log('body',body)
      try {
        let res = await SamplingAPI.updateConfigSchedule(stationID, body)
        this.props.updateParentState({
          isScheduled: true
        })
      }
      catch(e) {
        /* MARK  -- @Thao: tra ve code phia server de frontend translate */
        swal({title: i18n.alertErrorUpdateScheduleSubtitle, type: 'error'}) 
        // swal({title: `${e.response.data.error.message}`, type: 'error'}) 
        this.props.updateParentState({
          isScheduled: false
        })
      }
      this.setState({isScheduleUpdating: false})
    }
  }


  render(){
    const { STATUS_SAMPLING, isScheduled } = this.props;
    const {totalBottles, sampledBottles, status} = this.props.configSampling;
    const { numberBottles, frequency, dateTimeStart } = this.props.configSamplingSchedule
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const {isScheduleUpdating, samplingType} = this.state;
    const isFullBottles = sampledBottles >= totalBottles
    const isSampling = status !== STATUS_SAMPLING.READY
    // NOTE  -- MOCK DATA
    let {isActivedOverRange } = this.state;
    return (
      <div style={{padding: 8}}>
        {/* -- FORM NHAP SO CHAI -- */}
        <Row> 
          <Form id="form-sample-reset" layout="vertical" onSubmit={this.handleSubmitFormReset} wrapperCol={{span: 24}}>
            <Row gutter={16}>
              <Col span={11}>
                <FormItem style={{width: '100%'}} label={i18n.totalBottles}>
                  <InputNumber disabled value={totalBottles} style={{width: '100%'}}/>
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem style={{width: '100%'}} label={i18n.sampledBottles}>
                  <InputNumber disabled value={sampledBottles} style={{width: '100%'}}/>
                </FormItem>
              </Col>
              <Col span={2} style={{textAlign: 'center'}} >
                <FormItem label="&nbsp;">
                  <Button block type="primary" onClick={this.handleSubmitFormReset} disabled={ isScheduled || isSampling}>Reset</Button>
                </FormItem>
              </Col>
            </Row> 
          </Form>
        </Row>

        {/* -- SAMPLING TYPE --*/}
        <Row>
          <Row style={{marginBottom: 20}}>
            <Row style={{marginBottom: 5}}>{i18n.typeOfSampling}</Row>
            <RadioGroup defaultValue={samplingType} onChange={this.handleSamplingTypeChange} buttonStyle="solid">
              <RadioButton value={SAMPLING_TYPE.MANUAL} disabled={isScheduled}>{i18n.immediatelySampling}</RadioButton>
              <RadioButton value={SAMPLING_TYPE.AUTO} disabled={isSampling && !isScheduled}>{i18n.scheduleSampling}</RadioButton>
            </RadioGroup> 
          </Row>

          {/* -- TOGGLE SAMPLING MODE --*/}
          { samplingType === SAMPLING_TYPE.AUTO && (
            <Form id="form-sample-auto" onSubmit={this.handleSubmitFormSampleAuto}>
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem style={{width: '100%'}} label={i18n.bottlesNeedToTake}>
                    {getFieldDecorator('bottlesNeedToTake', {
                      rules: [{ 
                        required: true,
                        min: 1,
                        max: totalBottles-sampledBottles,
                        type: 'integer',
                        message: i18n.alertNull}],
                        initialValue: numberBottles 
                    })(
                      <InputNumber disabled={isScheduled } style={{width: '100%'}}/>
                    )}
                  </FormItem>
                  <FormItem style={{width: '100%'}} label={i18n.timeStartSampling}>
                    {getFieldDecorator('timeStartSampling', {
                      rules: [{ 
                        required: true, 
                        message: i18n.alertNull}],
                        initialValue:  moment(dateTimeStart)
                    })(
                      <TimePicker disabled={isScheduled}  format="HH:mm" style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem style={{width: '100%'}} label={i18n.frequency}>
                    {getFieldDecorator('frequency', {
                      rules: [{ 
                        required: true, 
                        min: 1,
                        type: 'integer',
                        message: i18n.alertNull}],
                        initialValue:  frequency 
                    })(
                      <InputNumber disabled={isScheduled} style={{width: '100%'}}/>
                    )}
                  </FormItem>
                  <FormItem style={{width: '100%'}} label={i18n.dateStartSampling}>
                    {getFieldDecorator('dateStartSampling', {
                      rules: [{ 
                        required: true, 
                        message: i18n.alertNull}],
                        initialValue:  moment(dateTimeStart)
                    })(
                      <DatePicker disabled={isScheduled} format="DD/MM/YYYY"  style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          )}
        </Row>

        {/* -- ACTIONS -- */}
        <Row>
          { samplingType === SAMPLING_TYPE.MANUAL && (
            <Button 
              block 
              type="primary" 
              disabled={isFullBottles}
              style={{marginBottom: 8, ...STATUS_COLOR[status] }}  
              onClick={this.handleClickSampling} 
              loading={status === STATUS_SAMPLING.SAMPLING || status === STATUS_SAMPLING.COMMANDED}
              >
              { status === STATUS_SAMPLING.READY && i18n.takeSample }
              { status === STATUS_SAMPLING.COMMANDED && i18n.commandSent }
              { status === STATUS_SAMPLING.SAMPLING && i18n.takingSample }
            </Button>
          )}
          {/* active button */}
          { samplingType === SAMPLING_TYPE.AUTO && !isScheduled && (
            <Button 
              block 
              type="primary" 
              disabled={isFormError(getFieldsError())}
              style={{marginBottom: 8}}  
              onClick={this.handleClickActive} 
              loading={isScheduleUpdating}
              >
              { isScheduled ? i18n.actived : i18n.active}
            </Button>
          )}
          {/* actived button */}
          { samplingType === SAMPLING_TYPE.AUTO && isScheduled && (
            <Button 
              block 
              type="primary" 
              style={{marginBottom: 8, ...STATUS_COLOR[isScheduled && 'ACTIVED'] }}  
              onClick={this.cancelConfigSchedule} 
              loading={isScheduleUpdating}
              >
              { isScheduled ? i18n.actived : i18n.active}
            </Button>
          )}
          {/* NOTE  nút này chưa cần xử lý*/}
          <Button block type="primary" style={{...STATUS_COLOR[isActivedOverRange && 'ACTIVED']}} onClick={() => this.setState({isActivedOverRange: !isActivedOverRange})} >{isActivedOverRange ?  i18n.activedOverRange : i18n.activeOverRange}</Button>
        </Row>
      </div>
    )
  }
}

