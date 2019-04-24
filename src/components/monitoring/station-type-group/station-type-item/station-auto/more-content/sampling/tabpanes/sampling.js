/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import swal from 'sweetalert2';
import {
  Row, Col,
  Card,
  Form, InputNumber, Button,Radio, Input,
  TimePicker, DatePicker, message
} from 'antd';
import moment from 'moment';
/* user import */
import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'

const i18n = {
  totalBottles        : translate('monitoring.moreContent.sampling.content.totalBottles'),
  sampledBottles      : translate('monitoring.moreContent.sampling.content.sampledBottles'),
  immediatelySampling : translate('monitoring.moreContent.sampling.content.immediatelySampling'),
  scheduleSampling    : translate('monitoring.moreContent.sampling.content.scheduleSampling'),
  bottlesNeedToTake   : translate('monitoring.moreContent.sampling.content.bottlesNeedToTake'),
  timeStartSampling   : translate('monitoring.moreContent.sampling.content.timeStartSampling'),
  frequency           : translate('monitoring.moreContent.sampling.content.frequency'),
  dateStartSampling   : translate('monitoring.moreContent.sampling.content.dateStartSampling'),
  takeSample          : translate('monitoring.moreContent.sampling.content.takeSample'),
  commandSent         : translate('monitoring.moreContent.sampling.content.commandSent'),
  takingSample        : translate('monitoring.moreContent.sampling.content.takingSample'),
  activeTakeSample    : translate('monitoring.moreContent.sampling.content.activeTakeSample'),
  typeOfSampling      : translate('monitoring.moreContent.sampling.content.typeOfSampling'),
  alertSuccess: translate('success.text'),
  alertError: translate('error.text'),
}

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

// const STATUS_SAMPLING = { READY:'READY', COMMANDED:'COMMANDED', SAMPLING:'SAMPLING' }

const STATUS_COLOR = {
  READY: '',
  COMMANDED: '',
  SAMPLING: {
    backgroundColor: 'orange',
    borderColor: 'orange'
  }
}


function showMessageError(text) { message.error(text) }

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string,
    configSampling: PropTypes.object,
  }

  static defaultProps = {
    stationID: '',
    configSampling: {
      totalBottles: 0,
      sampledBottles: 0,
      controlTagName: '',
      timeToTakeOneBottle: 0,
      status: ''
    }
  }

  state = {
    isReseting: false,
    samplingType: 'manual',                       /* manual || auto */
  }

  handleReset = (e) => {
    /* TASK -- add logic */
    this.setState({isReseting: true})
    setTimeout(() => {
      this.setState({isReseting: false})
    }, 1000);
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
          console.log(res)
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
          swal({title: message, type: 'error'})
          this.props.updateParentState({
            configSampling: {
              ...this.props.configSampling,
              status: STATUS_SAMPLING.READY
            }
          })
        })
    }
  }

  render(){
    const { STATUS_SAMPLING } = this.props;
    const {isReseting, samplingType} = this.state;
    const {totalBottles, sampledBottles, status} = this.props.configSampling;
    const isFullBottles = sampledBottles == totalBottles
    const isSampling = status !== STATUS_SAMPLING.READY
    return (
      <div style={{padding: 8}}>
        {/* -- FORM NHAP SO CHAI -- */}
        <Row style={{marginBottom: 30}}> 
          <Row gutter={16}>
            <Col span={11}>{i18n.totalBottles}</Col>
            <Col span={11}>{i18n.sampledBottles}</Col>
            <Col span={2}></Col>
          </Row>
          <Form layout="inline" onSubmit={this.handleSubmit} wrapperCol={{span: 24}}>
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item style={{width: '100%'}}>
                  <InputNumber disabled value={totalBottles} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item style={{width: '100%'}}>
                  <InputNumber disabled value={sampledBottles} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={2} style={{textAlign: 'center'}} >
                <Form.Item>
                  <Button block type="primary" disabled={isSampling} onClick={this.handleReset}>Reset</Button>
                </Form.Item>
              </Col>
            </Row> 
          </Form>
        </Row>

        {/* -- SAMPLING TYPE --*/}
        <Row>
          <Row style={{marginBottom: 30}}>
            <Row style={{marginBottom: 5}}>{i18n.typeOfSampling}</Row>
            <RadioGroup defaultValue={samplingType} onChange={this.handleSamplingTypeChange} buttonStyle="solid">
              <RadioButton value="manual">{i18n.immediatelySampling}</RadioButton>
              <RadioButton value="auto">{i18n.scheduleSampling}</RadioButton>
            </RadioGroup> 
          </Row>

          {/* -- SAMPLING TYPE: AUTO */}
          { samplingType === "auto" && (
            <Row gutter={16}>
              <Col span={12}>
                <Row>{i18n.bottlesNeedToTake}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <InputNumber defaultValue="2" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
                <Row>{i18n.timeStartSampling}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <TimePicker defaultValue={moment(Date.now(), "HH:mm")} format="HH:mm" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
              </Col>
              <Col span={12}>
                <Row>{i18n.frequency}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <InputNumber defaultValue="30" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
                <Row>{i18n.dateStartSampling}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <DatePicker defaultValue={moment(Date.now())} format="DD/MM/YYYY"  style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          )}
        </Row>

        {/* -- ACTIONS -- */}
        <Row>
          <Button 
            block 
            type="primary" 
            disabled={isFullBottles}
            style={{marginBottom: 8, ...STATUS_COLOR[status] }}  
            onClick={this.handleClickSampling.bind(this)} 
            loading={status === STATUS_SAMPLING.SAMPLING || status === STATUS_SAMPLING.COMMANDED}>
            { status === STATUS_SAMPLING.READY && i18n.takeSample }
            { status === STATUS_SAMPLING.COMMANDED && i18n.commandSent }
            { status === STATUS_SAMPLING.SAMPLING && i18n.takingSample }
          </Button>
          {/* NOTE  nút này chưa cần xử lý*/}
          <Button block type="primary">{i18n.activeTakeSample}</Button>
        </Row>
      </div>
    )
  }
}

