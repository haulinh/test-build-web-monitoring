/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import {
  Row, Col,
  Card,
  Form, InputNumber, Button,Radio, Input,
  TimePicker, DatePicker
} from 'antd';
import moment from 'moment';
/* user import */
import { translate } from 'hoc/create-lang'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const STATUS_SAMPLING = { READY:'READY', COMMANDED:'COMMANDED', SAMPLING:'SAMPLING' }

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    isReseting: false,
    statusSampling: STATUS_SAMPLING.READY,        /* ready || commanded || sampling */
    samplingType: 'manual',    /* manual || auto */
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  handleReset = (e) => {
    this.setState({isReseting: true})
    setTimeout(() => {
      this.setState({isReseting: false})
    }, 1000);
  }

  handleSamplingTypeChange = (e) => {
    this.setState({samplingType: e.target.value})
  }

  handleSampling = () => {
    this.setState({statusSampling: STATUS_SAMPLING.COMMANDED})
    setTimeout(() => {
      this.setState({statusSampling: STATUS_SAMPLING.SAMPLING})
    }, 1000)

    setTimeout(() => {
      this.setState({statusSampling: STATUS_SAMPLING.READY})
    }, 2000)
  }

  render(){
    const {isReseting, statusSampling, samplingType} = this.state;
    const {} = this.props;

    return (
      <div style={{padding: 8}}>
        {/* -- FORM NHAP SO CHAI -- */}
        <Row style={{marginBottom: 30}}> 
          <Row gutter={16}>
            <Col span={11}>{translate('monitoring.moreContent.sampling.content.totalBottles')}</Col>
            <Col span={11}>{translate('monitoring.moreContent.sampling.content.sampledBottles')}</Col>
            <Col span={2}></Col>
          </Row>
          <Form layout="inline" onSubmit={this.handleSubmit} wrapperCol={{span: 24}}>
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item style={{width: '100%'}}>
                  <InputNumber disabled defaultValue="8" style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item style={{width: '100%'}}>
                  <InputNumber disabled defaultValue="0" style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" block onClick={this.handleReset}>Reset</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Row>

        {/* -- SAMPLING TYPE --*/}
        <Row>
          <Row>
            <span>{translate('monitoring.moreContent.sampling.content.typeOfSampling')}</span>
            <RadioGroup defaultValue={samplingType} onChange={this.handleSamplingTypeChange} buttonStyle="solid"  style={{margin: '0 0 30px 15px'}}>
              <RadioButton value="manual">{translate('monitoring.moreContent.sampling.content.immediatelySampling')}</RadioButton>
              <RadioButton value="auto">{translate('monitoring.moreContent.sampling.content.scheduleSampling')}</RadioButton>
            </RadioGroup> 
          </Row>
          {/* -- SAMPLING TYPE: AUTO */}
          { samplingType === "auto" && (
            <Row gutter={16}>
              <Col span={12}>
                <Row>{translate('monitoring.moreContent.sampling.content.bottlesNeedToTake')}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <InputNumber defaultValue="2" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
                <Row>{translate('monitoring.moreContent.sampling.content.timeStartSampling')}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <InputNumber defaultValue="0" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
              </Col>
              <Col span={12}>
                <Row>{translate('monitoring.moreContent.sampling.content.frequency')}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <TimePicker defaultValue={moment(Date.now(), "HH:mm")} format="HH:mm" style={{width: '100%'}}/>
                  </Form.Item>
                </Row>
                <Row>{translate('monitoring.moreContent.sampling.content.dateStartSampling')}</Row>
                <Row>
                  <Form.Item style={{width: '100%'}}>
                    <DatePicker defaultValue={moment(Date.now(), "dd/mm/yyyy")} format="dd/mm/yyyy" style={{width: '100%'}}/>
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
            style={{marginBottom: 8}}  
            onClick={this.handleSampling} 
            loading={statusSampling === STATUS_SAMPLING.SAMPLING || statusSampling === STATUS_SAMPLING.COMMANDED}>
            { statusSampling === STATUS_SAMPLING.READY && translate('monitoring.moreContent.sampling.content.takeSample') }
            { statusSampling === STATUS_SAMPLING.COMMANDED && translate('monitoring.moreContent.sampling.content.commanded') }
            { statusSampling === STATUS_SAMPLING.SAMPLING && translate('monitoring.moreContent.sampling.content.takingSample') }
          </Button>
          {/* NOTE  nút này chưa cần xử lý*/}
          <Button block type="primary">{translate('monitoring.moreContent.sampling.content.activeTakeSample')}</Button>
        </Row>
      </div>
    )
  }
}

