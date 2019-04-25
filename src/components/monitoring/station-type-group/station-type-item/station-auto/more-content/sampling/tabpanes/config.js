/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import styled from 'styled-components'
import {Row, Col, Form, Input, InputNumber, Button, cr} from 'antd';
import swal from 'sweetalert2';
/* user import */
import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'
import { prop } from 'cramda';
import { resetAuthToken } from 'utils/auth';

const FormItem = Form.Item

const i18n = {
  totalBottles: translate('monitoring.moreContent.sampling.content.config.totalBottles'),
  controlTagName: translate('monitoring.moreContent.sampling.content.config.controlTagName'),
  timeToTakeOneBottle: translate('monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'),
  save: translate('monitoring.moreContent.sampling.content.config.save'),
  alertNull: translate('error.nullValue'),
  alertSuccess: translate('success.text'),
  alertError: translate('error.text'),
}


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string.isRequired,
    configSampling: PropTypes.object.isRequired,
    updateParentState: PropTypes.func.isRequired
  }

  static defaultProps = {
    stationID: '',
    configSampling: {
      totalBottles: 0,
      controlTagName: '',
      timeToTakeOneBottle: 0
    }
  }

  state = {
    isSaving: false,
  }

  handleSave = () => {
    this.setState({isSaving: true})
    setTimeout(() => {
      this.setState({isSaving: false})
    }, 1000)
  }

  handleSubmit = (e) => {
    this.setState({isSaving: true})
    const {stationID} = this.props
    e.preventDefault();
    this.props.form.validateFields( async (err, values) => {
      console.log(err)
      if (!err) {
        const res = await SamplingAPI.updateConfig(stationID, {configSampling: values})
        this.setState({isSaving: false})
        swal({ title: i18n.alertSuccess, type: 'success' })
        this.props.updateParentState({
          isConfig: true, 
          configSampling: res.data.configSampling
          })
        return
      }
      this.setState({isSaving: false})
      swal({ title: i18n.alertError, type: 'error' })
    });
  }

  checkErr = (name) => {
    const { getFieldDecorator, isFieldTouched, getFieldError } = this.props.form;
    return isFieldTouched(name) && getFieldError(name);
  }

  render(){
    const {STATUS_SAMPLING} = this.props
    const { isSaving } = this.state;
    const { totalBottles, controlTagName, timeToTakeOneBottle, status } = this.props.configSampling;
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const isSampling = status !== STATUS_SAMPLING.READY

    return (
      <div style={{padding: 8}}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Row>{i18n.totalBottles}</Row>
              <Row>
                <Form.Item
                  validateStatus={this.checkErr('totalBottles') ? 'error' : ''}
                  help={this.checkErr('totalBottles') || ''}
                >
                  {getFieldDecorator('totalBottles', {
                    rules: [{ 
                      required: true, 
                      min: 1,
                      type: 'integer',
                      message: i18n.alertNull}],
                      initialValue: totalBottles
                  })(
                    <InputNumber style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Row>
              <Row>{i18n.controlTagName}</Row>
              <Row>
                <Form.Item
                  validateStatus={this.checkErr('controlTagName') ? 'error' : ''}
                  help={this.checkErr('controlTagName') || ''}
                >
                  {getFieldDecorator('controlTagName', {
                    rules: [{ required: true, message: i18n.alertNull }],
                    initialValue: controlTagName
                  })(
                    <Input style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Row>
              <Row>{i18n.timeToTakeOneBottle}</Row>
              <Row>
                <Form.Item
                  validateStatus={this.checkErr('timeToTakeOneBottle') ? 'error' : ''}
                  help={this.checkErr('timeToTakeOneBottle') || ''}
                >
                  {getFieldDecorator('timeToTakeOneBottle', {
                    rules: [{ 
                      required: true, 
                      min: 1, 
                      type: 'integer',
                      message: i18n.alertNull 
                    }],
                    initialValue: timeToTakeOneBottle
                  })(
                    <InputNumber style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Row>
              <Button 
                block
                isLoading={isSaving}
                type="primary"
                loading={isSaving}
                disabled={hasErrors(getFieldsError()) || isSampling}
                htmlType="submit">
                {i18n.save}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

