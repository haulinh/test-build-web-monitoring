/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import {Row, Col, Form, Input, InputNumber, Button} from 'antd';
import swal from 'sweetalert2';
/* user import */
import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'

const FormItem = Form.Item

const i18n = {
  totalBottles       : translate('monitoring.moreContent.sampling.content.config.totalBottles'),
  controlTagName     : translate('monitoring.moreContent.sampling.content.config.controlTagName'),
  timeToTakeOneBottle: translate('monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'),
  save               : translate('monitoring.moreContent.sampling.content.config.save'),
  alertNull          : translate('error.nullValue'),
  alertSuccess       : translate('success.text'),
  alertError         : translate('error.text'),
  alertSaveConfigError         : translate('alert.error.monitoring.saveSampingConfig'),
}


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@withRouter
export default class SamplingConfig extends React.Component {
  static propTypes = {
    stationID: PropTypes.string.isRequired,
    configSampling: PropTypes.object.isRequired,
    configSamplingSchedule: PropTypes.object,
    updateParentState: PropTypes.func.isRequired
  }

  static defaultProps = {
    stationID: '',
    configSampling: {
      totalBottles: 1,
      controlTagName: '',
      timeToTakeOneBottle: 1
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
    e.preventDefault();
    this.setState({isSaving: true})
    const {stationID} = this.props
  
    this.props.form.validateFields( async (err, values) => {
      if(err){
        this.setState({isSaving: false})
        swal({ title: i18n.alertSaveConfigError, type: 'error' })
        return
      }

      try {
        const res = await SamplingAPI.updateConfig(stationID, {configSampling: values})
        this.setState({isSaving: false})
        swal({ title: i18n.alertSuccess, type: 'success' })
        this.props.updateParentState({
          isConfig: true, 
          configSampling: res.data.configSampling
          })
      }
      catch(error) {
        this.setState({isSaving: false})
        const { message} = err.response.data.error
        swal({ title: message, type: 'error' })
      }
    });
  }

  checkErr = (name) => {
    const { isFieldTouched, getFieldError } = this.props.form;
    return isFieldTouched(name) && getFieldError(name);
  }

  render(){
    const {STATUS_SAMPLING, isConfig, isScheduled} = this.props
    const { isSaving } = this.state;
    const { totalBottles, controlTagName, timeToTakeOneBottle, status } = this.props.configSampling;
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form; 
    const isSampling = isConfig && status !== STATUS_SAMPLING.READY
    // console.log('fffdasfdsafas', hasErrors(getFieldsError()))
    return (
      <div style={{padding: 8}}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Row>
                <FormItem
                  label={i18n.totalBottles}
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
                    <InputNumber style={{width: '100%'}} disabled={ isSampling || isScheduled}/>
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem
                  label={i18n.controlTagName}
                  validateStatus={this.checkErr('controlTagName') ? 'error' : ''}
                  help={this.checkErr('controlTagName') || ''}
                >
                  {getFieldDecorator('controlTagName', {
                    rules: [{ required: true, message: i18n.alertNull }],
                    initialValue: controlTagName
                  })(
                    <Input style={{width: '100%'}} disabled={isSampling || isScheduled}/>
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem
                  label={i18n.timeToTakeOneBottle}
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
                    <InputNumber style={{width: '100%'}} disabled={isSampling || isScheduled}/>
                  )}
                </FormItem>
              </Row>
              <Button
                block
                type="primary"
                loading={isSaving}
                disabled={(hasErrors(getFieldsError()) && isFieldsTouched()) || isSampling || isScheduled}
                htmlType="submit"
                >
                {i18n.save}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

