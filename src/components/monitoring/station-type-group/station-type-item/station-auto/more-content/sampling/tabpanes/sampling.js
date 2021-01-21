import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Steps,
  TimePicker,
} from 'antd'
import SamplingAPI from 'api/SamplingApi'
/* user import */
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import swal from 'sweetalert2'

const { Option } = Select
const { Step } = Steps

const i18n = {
  /*  */
  reset: translate('monitoring.moreContent.sampling.content.reset'),
  totalBottles: translate(
    'monitoring.moreContent.sampling.content.totalBottles'
  ),
  sampledBottles: translate(
    'monitoring.moreContent.sampling.content.sampledBottles'
  ),
  /* sampling mode */
  methodSampling: translate(
    'monitoring.moreContent.sampling.content.methodSampling'
  ),
  // 'Giao thức lấy mẫu',
  typeOfSampling: translate(
    'monitoring.moreContent.sampling.content.typeOfSampling'
  ),
  immediatelySampling: translate(
    'monitoring.moreContent.sampling.content.immediatelySampling'
  ),
  scheduleSampling: translate(
    'monitoring.moreContent.sampling.content.scheduleSampling'
  ),
  bottlesNeedToTake: translate(
    'monitoring.moreContent.sampling.content.bottlesNeedToTake'
  ),
  timeStartSampling: translate(
    'monitoring.moreContent.sampling.content.timeStartSampling'
  ),
  frequency: translate('monitoring.moreContent.sampling.content.frequency'),
  dateStartSampling: translate(
    'monitoring.moreContent.sampling.content.dateStartSampling'
  ),
  /* button lay mau thu cong */
  takeSample: translate('monitoring.moreContent.sampling.content.takeSample'),
  commandSent: translate('monitoring.moreContent.sampling.content.commandSent'),
  takingSample: translate(
    'monitoring.moreContent.sampling.content.takingSample'
  ),
  /*button sampling exceeded */
  takeSampleExceeded: translate(
    'monitoring.moreContent.sampling.content.takeSampleExceeded'
  ),
  cancelTakeSampleExceeded: translate(
    'monitoring.moreContent.sampling.content.cancelTakeSampleExceeded'
  ),
  /* button lay mau tu dong */
  active: translate('monitoring.moreContent.sampling.content.active'),
  actived: translate('monitoring.moreContent.sampling.content.actived'),
  /* button lay mau vuot nguong */
  activeOverRange: translate(
    'monitoring.moreContent.sampling.content.activeOverRange'
  ),
  activedOverRange: translate(
    'monitoring.moreContent.sampling.content.activedOverRange'
  ),
  /* alerts */
  alertNull: translate('error.nullValue'),
  alertSuccess: translate('success.text'),
  alertError: translate('error.text'),
  alertWarning: translate('error.warningText'),
  alertModalResetTitle: translate('error.monitoring.sampling.resetTitle'),
  alertModalResetSubtitle: translate('error.monitoring.sampling.resetSubtitle'),
  alertErrorUpdateScheduleSubtitle: translate(
    'error.monitoring.sampling.updateScheduleSubtitle'
  ),
  alertErrorTakeSampling: translate('error.monitoring.sampling.takeSampling'),
  /*  */
  modalConfirm: translate('modal.confirm.title'),
  cancelConfigSchedule: translate(
    'modal.confirm.monitoring.sampling.cancelSchedule'
  ),
  cancelExceededSampling: translate(
    'modal.confirm.monitoring.sampling.cancelExceededSampling'
  ),
  step1: translate('controlStation.listStep.step1'),
  step2: translate('controlStation.listStep.step2'),
  step3: translate('controlStation.listStep.step3'),
  step4: translate('controlStation.listStep.step4'),
  cancel: translate('addon.cancel'),
}

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const FormItem = Form.Item
// const ModalConfirm = Modal.confirm;

const STATUS_COLOR = {
  READY: '',
  COMMANDED: '',
  SAMPLING: {
    backgroundColor: 'orange',
    borderColor: 'orange',
  },
  ACTIVED: {
    backgroundColor: 'orange',
    borderColor: 'orange',
  },
}

const SAMPLING_TYPE = {
  MANUAL: 'MANUAL',
  AUTO: 'AUTOMATIC',
  EXCEEDED: 'EXCEEDED',
}

const fieldNames = {
  sampledBottles: 'sampledBottles',
}

function isFormError(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const ConfigHeaderWrapper = styled.div`
  display: flex;
`

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
)

@Form.create()
@withRouter
export default class SamplingTab extends React.Component {
  constructor(props) {
    super(props)
    /* viết kiểu này để fix lỗi _this10 do babel k hỗ trợ async/await */
    this.resetSampledBottle = this.resetSampledBottle.bind(this)
    this.handleSubmitFormReset = this.handleSubmitFormReset.bind(this)
    this.handleClickActive = this.handleClickActive.bind(this)
    this.cancelConfigSchedule = this.cancelConfigSchedule.bind(this)

    // const { samplingTypeActive } = props

    this.state = {
      isReseting: false,
      // mock states
      isActivedOverRange: false,
      isScheduleUpdating: false,
      samplingType: this.props.isScheduled
        ? SAMPLING_TYPE.AUTO
        : SAMPLING_TYPE.MANUAL,
      samplingProtocol: 'SQL',
      currentStep: this.props.configSampling.status,
      sampledBottles: this.props.configSampling.sampledBottles,
      // samplingTypeActive,
      isLoadingUpdateSamplingType: false,
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.configSampling.status !== nextProps.configSampling.status) {
      this.setState({
        currentStep: nextProps.configSampling.status,
      })
    }

    if (
      this.props.configSampling.status === 'SAMPLING' &&
      nextProps.configSampling.status === 'READY'
    ) {
      const log = await SamplingAPI.getHistory({
        stationAutoId: this.props.stationID,
      })
      console.log(log, '-----------------------log')
      if (log.data && log.data[0].result === 'FAILED') {
        swal({
          title: i18n.alertWarning,
          html: i18n.alertErrorTakeSampling,
          width: 600,
          type: 'warning',
        })
      } else if (log.data && log.data[0].result === 'SUCCESS') {
        this.setState({
          currentStep: 'SUCCESS',
          sampledBottles: this.state.sampledBottles + 1,
        })
      }
    }

    if (nextProps.configSampling.sampledBottles !== this.state.sampledBottles) {
      this.setState({
        sampledBottles: nextProps.configSampling.sampledBottles,
      })
    }
  }

  handleChanggeSamplingProtocol = value => {
    this.setState({ samplingProtocol: value })
  }

  renderSamplingProgress = ({ currentStep = 'COMMANDED' }) => {
    const { STATUS_SAMPLING } = this.props

    const getCurrentStepIndex = () => {
      switch (currentStep) {
        case STATUS_SAMPLING.COMMANDED:
          return 1
        case STATUS_SAMPLING.SAMPLING:
          return 2
        case 'SUCCESS':
          return 3
        default:
          return 0
      }
    }
    const StepWrapper = styled.div`
      .ant-steps-item-content {
        margin-top: -40px;
      }
      margin-top: 4em;
    `
    return (
      <StepWrapper>
        <Steps current={getCurrentStepIndex()} progressDot={customDot}>
          <Step title={i18n.step1} />
          <Step title={i18n.step2} />
          <Step title={i18n.step3} />
          <Step title={i18n.step4} />
        </Steps>
      </StepWrapper>
    )
  }
  renderTakenBottles = ({ takenBottles, totalBottles }) => {
    const TakendBottleWrapper = styled.div`
      color: #1890ff;
      position: relative;
      top: 2em;
      font-size: 16px;
      align-self: center;
      margin-bottom: 1em;
      display: flex;
      justify-content: center;
    `

    return (
      <TakendBottleWrapper>
        <span>
          Số chai đã lấy: {takenBottles}/{totalBottles}
        </span>
      </TakendBottleWrapper>
    )
  }

  async resetSampledBottle(e) {
    let { stationID } = this.props
    let res = await SamplingAPI.resetSampledBottle(stationID)
    if (res.success) {
      let { sampledBottles } = res.data.configSampling
      this.props.updateParentState({
        configSampling: {
          ...this.props.configSampling,
          sampledBottles,
        },
      })
    }
    return res
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
    })
  }
  /* TODO  LATER */
  handleSubmitFormSampleAuto = e => {
    e.preventDefault()
  }

  handleSamplingTypeChange = e => {
    this.setState({ samplingType: e.target.value })
  }

  async takeSample() {
    const { STATUS_SAMPLING } = this.props
    this.props.updateParentState({
      configSampling: {
        ...this.props.configSampling,
        status: STATUS_SAMPLING.COMMANDED,
      },
    })
    const { stationID } = this.props
    return SamplingAPI.takeSampling(stationID, {
      configSampling: { protocol: this.state.samplingProtocol },
    })
  }

  async handleClickSampling() {
    const { STATUS_SAMPLING } = this.props
    const { status } = this.props.configSampling
    try {
      if (status === STATUS_SAMPLING.READY) {
        const res = await this.takeSample()

        if (res.success) {
          const { status, sampledBottles } = res.data.configSampling

          /* tăng số chai đã lấy */
          if (status === STATUS_SAMPLING.SAMPLING) {
            this.props.form.setFieldsValue({
              [fieldNames.sampledBottles]: sampledBottles,
            })
          }

          /* update data lên parent component để các component khác biết trạng thái lấy mẫu */
          this.props.updateParentState({
            configSampling: {
              ...this.props.configSampling,
              status: status,
            },
          })
        }
      }
    } catch (err) {
      swal({
        title: i18n.alertWarning,
        html: i18n.alertErrorTakeSampling,
        width: 600,
        type: 'warning',
      })
      this.props.updateParentState({
        configSampling: {
          ...this.props.configSampling,
          status: STATUS_SAMPLING.READY,
        },
      })
    }
  }

  async cancelConfigSchedule() {
    const { stationID } = this.props
    let me = this
    Modal.confirm({
      title: i18n.modalConfirm,
      content: i18n.cancelConfigSchedule,
      cancelText: i18n.cancel,
      async onOk() {
        const res = await SamplingAPI.cancelConfigSchedule(stationID)
        if (res.data.configSamplingSchedule === null) {
          me.props.updateParentState({
            isScheduled: false,
          })
        }
        return
      },
      onCancel() {},
    })
  }

  async handleClickActive() {
    this.props.updateParentState({
      isScheduled: true,
    })
    const { stationID, isScheduled } = this.props
    const { getFieldValue } = this.props.form

    if (!isScheduled) {
      let timeStartSampling = getFieldValue('timeStartSampling').format('HH:mm')
      let dateStartSampling = getFieldValue('dateStartSampling').format(
        'DD-MM-YYYY'
      )
      const body = {
        configSamplingSchedule: {
          numberBottles: getFieldValue('bottlesNeedToTake'),
          frequency: getFieldValue('frequency'),
          dateTimeStart: moment(
            `${dateStartSampling} ${timeStartSampling}`,
            'DD-MM-YYYY HH:mm'
          ).toDate(),
        },
      }
      this.setState({ isScheduleUpdating: true })
      console.log('body', body)
      try {
        // let res = await SamplingAPI.updateConfigSchedule(stationID, body)
        await SamplingAPI.updateConfigSchedule(stationID, body)
        this.props.updateParentState({
          isScheduled: true,
        })
      } catch (e) {
        /* MARK  -- @Thao: tra ve code phia server de frontend translate */
        swal({
          title: i18n.alertWarning,
          text: i18n.alertErrorUpdateScheduleSubtitle,
          type: 'warning',
        })
        // swal({title: `${e.response.data.error.message}`, type: 'error'})
        this.props.updateParentState({
          isScheduled: false,
        })
      }
      this.setState({ isScheduleUpdating: false })
    }
  }

  handleClickSamplingExceeded = async () => {
    const { stationID } = this.props
    try {
      this.setState({ isLoadingUpdateSamplingType: true })
      const data = await SamplingAPI.updateSamplingType(
        stationID,
        SAMPLING_TYPE.EXCEEDED
      )
      if (data) {
        this.setState({
          isLoadingUpdateSamplingType: false,
        })
        this.props.updateParentState({
          samplingTypeActive: SAMPLING_TYPE.EXCEEDED,
        })
      }
    } catch (error) {
      this.setState({
        isLoadingUpdateSamplingType: false,
      })
    }
  }

  handleClickCancelSamplingExceeded = async () => {
    const { stationID } = this.props
    Modal.confirm({
      title: i18n.modalConfirm,
      content: i18n.cancelExceededSampling,
      cancelText: i18n.cancel,
      onOk: async () => {
        try {
          const data = await SamplingAPI.updateSamplingType(
            stationID,
            SAMPLING_TYPE.MANUAL
          )
          if (data) {
            this.setState({
              isLoadingUpdateSamplingType: false,
            })
            this.props.updateParentState({
              samplingTypeActive: SAMPLING_TYPE.MANUAL,
            })
          }
        } catch (error) {
          console.log('error', error)
        }
      },
      onCancel() {},
    })
  }

  isRenderSamplingProcess = () => {
    const { samplingType, currentStep } = this.state
    const {
      configSampling: { status },
      STATUS_SAMPLING,
      samplingTypeActive,
    } = this.props

    return (
      status === STATUS_SAMPLING.COMMANDED ||
      status === STATUS_SAMPLING.SAMPLING ||
      (currentStep === 'SUCCESS' &&
        samplingType === SAMPLING_TYPE.MANUAL &&
        samplingTypeActive !== SAMPLING_TYPE.EXCEEDED)
    )
  }

  isDisableSamplingExceeded = () => {
    const {
      configExceededState,
      isScheduled,
      configSampling: { status },
      STATUS_SAMPLING,
      samplingTypeActive,
    } = this.props
    const isSampling = status !== STATUS_SAMPLING.READY
    const isConfigured = (Object.values(configExceededState || {}) || []).some(
      configItem => get(configItem, 'max.active') || get(configItem, 'min.active')
    )

    return (
      isScheduled ||
      isSampling ||
      (!isConfigured && samplingTypeActive !== SAMPLING_TYPE.EXCEEDED)
    )
  }

  render() {
    const { STATUS_SAMPLING, isScheduled, samplingTypeActive } = this.props
    const { isLoadingUpdateSamplingType } = this.state
    const { totalBottles, status } = this.props.configSampling
    const {
      numberBottles,
      frequency,
      dateTimeStart,
    } = this.props.configSamplingSchedule
    const { getFieldDecorator, getFieldsError } = this.props.form
    const { isScheduleUpdating, samplingType, currentStep } = this.state
    const isFullBottles =
      this.props.configSampling.sampledBottles >= totalBottles
    const isSampling = status !== STATUS_SAMPLING.READY
    // NOTE  -- MOCK DATA
    // let { isActivedOverRange } = this.state
    return (
      <div style={{ padding: '2em', paddingTop: '4px' }}>
        {/* -- SAMPLING TYPE --*/}
        <Row>
          <Row style={{ marginBottom: 20 }}>
            <ConfigHeaderWrapper>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '2em',
                }}
              >
                <span
                  style={{ marginBottom: '4px' }}
                  className="ant-form-item-required"
                >
                  {i18n.methodSampling}
                </span>
                <Select
                  style={{ width: 160 }}
                  defaultValue={this.state.samplingProtocol}
                  disabled
                  // onChange={this.handleChangeSamplingProtocol}
                >
                  {/* <Option value="MODBUS">ModBus</Option> */}
                  <Option value="SQL">Sql</Option>
                </Select>
              </div>

              <div>
                <Row style={{ marginBottom: 5 }}>{i18n.typeOfSampling}</Row>
                <RadioGroup
                  defaultValue={samplingType}
                  onChange={this.handleSamplingTypeChange}
                  buttonStyle="solid"
                >
                  <RadioButton
                    value={SAMPLING_TYPE.MANUAL}
                    disabled={
                      isScheduled ||
                      samplingTypeActive === SAMPLING_TYPE.EXCEEDED
                    }
                  >
                    {i18n.immediatelySampling}
                  </RadioButton>
                  <RadioButton
                    value={SAMPLING_TYPE.AUTO}
                    disabled={
                      (isSampling && !isScheduled) ||
                      samplingTypeActive === SAMPLING_TYPE.EXCEEDED
                    }
                  >
                    {i18n.scheduleSampling}
                  </RadioButton>
                </RadioGroup>
              </div>
            </ConfigHeaderWrapper>
          </Row>
        </Row>

        {/* -- FORM NHAP SO CHAI , tong so chai, so chai da lay-- */}
        <Row>
          <Form
            id="form-sample-reset"
            layout="vertical"
            onSubmit={this.handleSubmitFormReset}
            wrapperCol={{ span: 24 }}
          >
            <Row gutter={16}>
              <Col span={10}>
                <FormItem style={{ width: '100%' }} label={i18n.totalBottles}>
                  <InputNumber
                    disabled
                    value={totalBottles}
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem style={{ width: '100%' }} label={i18n.sampledBottles}>
                  <InputNumber
                    value={this.state.sampledBottles}
                    disabled
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <FormItem label="&nbsp;">
                  <Button
                    block
                    type="primary"
                    onClick={this.handleSubmitFormReset}
                    disabled={
                      isScheduled ||
                      isSampling ||
                      samplingTypeActive === SAMPLING_TYPE.EXCEEDED
                    }
                  >
                    {i18n.reset}
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Row>

        {/* -- TOGGLE SAMPLING MODE sampling auto form --*/}
        {samplingType === SAMPLING_TYPE.AUTO && (
          <Form
            id="form-sample-auto"
            onSubmit={this.handleSubmitFormSampleAuto}
          >
            <Row gutter={16}>
              <Col span={11}>
                <FormItem
                  style={{ width: '100%' }}
                  label={i18n.bottlesNeedToTake}
                >
                  {getFieldDecorator('bottlesNeedToTake', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        max: totalBottles - this.state.sampledBottles,
                        type: 'integer',
                        message: i18n.alertNull,
                      },
                    ],
                    initialValue: numberBottles,
                  })(
                    <InputNumber
                      disabled={isScheduled}
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
                <FormItem
                  style={{ width: '100%' }}
                  label={i18n.timeStartSampling}
                >
                  {getFieldDecorator('timeStartSampling', {
                    rules: [
                      {
                        required: true,
                        message: i18n.alertNull,
                      },
                    ],
                    initialValue: moment(dateTimeStart),
                  })(
                    <TimePicker
                      disabled={isScheduled}
                      format="HH:mm"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem style={{ width: '100%' }} label={i18n.frequency}>
                  {getFieldDecorator('frequency', {
                    rules: [
                      {
                        required: true,
                        min: 1,
                        type: 'integer',
                        message: i18n.alertNull,
                      },
                    ],
                    initialValue: frequency,
                  })(
                    <InputNumber
                      disabled={isScheduled}
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
                <FormItem
                  style={{ width: '100%' }}
                  label={i18n.dateStartSampling}
                >
                  {getFieldDecorator('dateStartSampling', {
                    rules: [
                      {
                        required: true,
                        message: i18n.alertNull,
                      },
                    ],
                    initialValue: moment(dateTimeStart),
                  })(
                    <DatePicker
                      disabled={isScheduled}
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        )}

        {/* -- ACTIONS -- */}
        <Row>
          {/* disable nút lấy mẫu khi các chai đã full */}
          {samplingType === SAMPLING_TYPE.MANUAL && (
            <Button
              block
              type="primary"
              disabled={
                isFullBottles || samplingTypeActive === SAMPLING_TYPE.EXCEEDED
              }
              style={{ marginBottom: 8, ...STATUS_COLOR[status] }}
              onClick={() => this.handleClickSampling()}
              loading={
                status === STATUS_SAMPLING.SAMPLING ||
                status === STATUS_SAMPLING.COMMANDED
              }
            >
              {status === STATUS_SAMPLING.READY && i18n.takeSample}
              {status === STATUS_SAMPLING.COMMANDED && i18n.commandSent}
              {status === STATUS_SAMPLING.SAMPLING && i18n.takingSample}
            </Button>
          )}

          {/* active button chưa lập lịch lấy mẫu*/}
          {samplingType === SAMPLING_TYPE.AUTO && !isScheduled && (
            <Button
              block
              type="primary"
              disabled={
                isFormError(getFieldsError()) ||
                samplingTypeActive === SAMPLING_TYPE.EXCEEDED
              }
              style={{ marginBottom: 8 }}
              onClick={this.handleClickActive}
              loading={isScheduleUpdating}
            >
              {isScheduled ? i18n.actived : i18n.active}
            </Button>
          )}
          {/* actived button đã lập lích lấy mấy, show button huỷ lịch*/}
          {samplingType === SAMPLING_TYPE.AUTO && isScheduled && (
            <Button
              block
              type="primary"
              style={{
                marginBottom: 8,
                ...STATUS_COLOR[isScheduled && 'ACTIVED'],
              }}
              onClick={this.cancelConfigSchedule}
              loading={isScheduleUpdating}
            >
              {isScheduled ? i18n.actived : i18n.active}
            </Button>
          )}
          {/* NOTE  nút này chưa cần xử lý*/}
          {/* <Button
            block
            type="primary"
            style={{ ...STATUS_COLOR[isActivedOverRange && 'ACTIVED'] }}
            onClick={() =>
              this.setState({ isActivedOverRange: !isActivedOverRange })
            }
          >
            {isActivedOverRange ? i18n.activedOverRange : i18n.activeOverRange}
          </Button> */}
        </Row>

        {samplingTypeActive !== SAMPLING_TYPE.EXCEEDED && (
          <Button
            loading={isLoadingUpdateSamplingType}
            block
            type="primary"
            disabled={this.isDisableSamplingExceeded()}
            style={{ marginBottom: 8 }}
            onClick={this.handleClickSamplingExceeded}
          >
            {i18n.takeSampleExceeded}
          </Button>
        )}

        {samplingTypeActive === SAMPLING_TYPE.EXCEEDED && (
          <Button
            loading={isLoadingUpdateSamplingType}
            block
            type="primary"
            style={{
              marginBottom: 8,
              backgroundColor: 'orange',
              borderColor: 'orange',
            }}
            onClick={this.handleClickCancelSamplingExceeded}
          >
            {i18n.cancelTakeSampleExceeded}
          </Button>
        )}

        {/* {(status === STATUS_SAMPLING.COMMANDED ||
          status === STATUS_SAMPLING.SAMPLING ||
          currentStep === 'SUCCESS') &&
          samplingType === SAMPLING_TYPE.MANUAL &&
          samplingTypeActive !== SAMPLING_TYPE.EXCEEDED &&
          this.renderSamplingProgress({
            currentStep,
          })} */}
        {this.isRenderSamplingProcess() &&
          this.renderSamplingProgress({
            currentStep,
          })}
      </div>
    )
  }
}

//

SamplingTab.propTypes = {
  stationID: PropTypes.string,
  isScheduled: PropTypes.bool,
  configSampling: PropTypes.object,
  configExceeded: PropTypes.object,
  configSamplingSchedule: PropTypes.object,
}

SamplingTab.defaultProps = {
  stationID: '',
  isScheduled: false,
  configSampling: {
    totalBottles: 0,
    sampledBottles: 0,
    controlTagName: '',
    timeToTakeOneBottle: 0,
    status: '',
  },
  configSamplingSchedule: {
    numberBottles: 3,
    frequency: 30,
    dateTimeStart: moment(),
  },
}
