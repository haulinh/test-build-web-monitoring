import animateScrollTo from 'animated-scroll-to'
import {
  Button,
  Col,
  // Radio,
  // Checkbox,
  Collapse,
  // Icon,
  // Upload,
  // Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select
} from 'antd'
import CategoryApi from 'api/CategoryApi'
import InputNumberCell from 'components/elements/input-number-cell'
import InputPhoneNumber from 'components/elements/input-phone-number'
import SelectProvice from 'components/elements/select-province'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectStationType from 'components/elements/select-station-type'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import { autobind } from 'core-decorators'
import _, { get, omit } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
// import { mapPropsToFields } from 'utils/form'
import styled from 'styled-components'
// import MediaApi from 'api/MediaApi'
import swal from 'sweetalert2'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import MeasuringTable from '../station-auto-formTable/'

const { TextArea } = Input
const { Panel } = Collapse
const { Option } = Select

const ConnectionStatusWrapper = styled.div`
  display: flex;
`
const FormItem = styled(Form.Item)`
  .ant-form-item-control {
    line-height: unset;
  }
`

const i18n = {
  key: {
    required: translate('stationAutoManager.form.key.required'),
    pattern: translate('stationAutoManager.form.key.pattern'),
    max: translate('stationAutoManager.form.key.max'),
  },
  name: {
    required: translate('stationAutoManager.form.name.required'),
    pattern: translate('stationAutoManager.form.name.pattern'),
    max: translate('stationAutoManager.form.name.max'),
  }
}

@Form.create({})
@createLanguageHoc
@autobind
export default class StationAutoForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      stationType: {},
      stationTypes: [],
      measuringList: [],
      measuringListSource: [],
      measuringOps: [],
      options: {},
      phones: [],
      emails: [],
      standardsVNObject: get(props, 'initialValues.standardsVN', null),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imgList: [],
      allowUpdateStandardsVN: props.isEdit,
      tabKey: ['1'],
      isStandardsVN: false,
    }
  }

  getInitialValues = () => {
    let { initialValues } = this.props
    if (!initialValues) return {}
    if (initialValues.stationType) {
      initialValues.stationTypeObject = initialValues.stationType
      initialValues.stationType = initialValues.stationType.key
    }
    if (initialValues.mapLocation) {
      initialValues = {
        ...initialValues,
        lat: initialValues.mapLocation.lat,
        long: initialValues.mapLocation.long,
      }
    }

    if (initialValues.activatedAt) {
      initialValues.activatedAt = moment(initialValues.activatedAt)
    }
    if (!initialValues.emails) initialValues.emails = []
    if (!initialValues.phones) initialValues.phones = []
    return initialValues
  }

  async componentWillMount() {
    const measuringList = await CategoryApi.getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )

    this.setState({
      measuringListSource: measuringList.data,
    })
    if (this.props.initialValues) {
      let fileList = []
      if (this.props.initialValues.image) {
        //set image display
        let img = this.props.initialValues.image
        fileList.push({
          uid: -1,
          url: img.url,
          name: img.file.originalname,
          status: 'done',
        })
      }

      this.setState({
        fileList,
      })
    }
  }

  componentDidMount() {
    const initialValues = this.getInitialValues()
    const minuteCount = _.get(
      initialValues,
      'config.lostConnection.minuteCount',
      null
    )

    const {
      connectionStatusTimeRange,
      connectionStatusNumber,
    } = this._convertMinutesToTimeRange(minuteCount)

    // vi dung state de luu nen phai gan gia tri initialValus vao state
    this.setState({
      emails: initialValues.emails,
      phones: initialValues.phones,
      measuringList: initialValues.measuringList,
      stationType: initialValues.stationType,
      stationTypeObject: initialValues.stationTypeObject,
      options: initialValues.options ? initialValues.options : {},
    })
    try {
      console.log({
        ...omit(initialValues, 'measuringList'),
        connectionStatusNumber,
        connectionStatusTimeRange,
      })
      this.props.form.setFieldsValue({
        ...omit(initialValues, 'measuringList'),
        connectionStatusNumber,
        connectionStatusTimeRange,
      })
    } catch (error) {
      console.log(error, '----')
    }

    if (this.props.otherForm) {
      animateScrollTo(9999999, {
        speed: 900,
      })
    }
  }

  _transformLostConnectionData = data => {
    const { connectionStatusNumber, connectionStatusTimeRange } = data
    let multipler = 1
    switch (connectionStatusTimeRange) {
      case 'HOURS':
        multipler = 60
        break
      case 'MINUTES':
        multipler = 1
        break
      case 'DAYS':
        multipler = 1140
        break
      default:
        multipler = 1
        break
    }
    return { minuteCount: connectionStatusNumber * multipler }
  }

  _convertMinutesToTimeRange = minutes => {
    if (minutes === null) {
      return {
        connectionStatusTimeRange: 'DAYS',
        connectionStatusNumber: 2,
      }
    }

    let result = {
      connectionStatusTimeRange: 'MINUTES',
      connectionStatusNumber: minutes,
    }
    if (minutes % 1140 === 0) {
      result.connectionStatusTimeRange = 'DAYS'
      result.connectionStatusNumber = minutes / 1140
    } else if (minutes % 60 === 0) {
      result.connectionStatusTimeRange = 'HOURS'
      result.connectionStatusNumber = minutes / 60
    }

    return result
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({
          tabKey: ['1'],
        })
        return
      }

      let measuringList = this.state.measuringList
      if (!measuringList || !measuringList[0].key) {
        const { t } = this.props.lang
        swal({
          title: t('stationAutoManager.addMeasuring.error'),
          type: 'error',
        })
        this.setState({
          tabKey: ['3'],
        })
        return
      } else {
        measuringList = _.map(this.state.measuringList, item => {
          const dtFind = _.find(this.state.measuringListSource, obj => {
            return obj.key === item.key
          })
          if (dtFind) {
            return {
              ...item,
              name: dtFind.name,
            }
          }
        })
      }

      const data = {
        key: values.key,
        name: values.name,
        mapLocation: { long: values.long, lat: values.lat },
        address: values.address,
        emails: this.state.emails,
        phones: this.state.phones,
        stationType: this.state.stationTypeObject,
        province: this.state.provinceObject,
        standardsVN: this.state.standardsVNObject,
        activatedAt: values.activatedAt,
        dataFrequency: values.dataFrequency,
        note: values.note,
        measuringList: _.compact(measuringList), // values.measuringList,
        options: this.state.options,
        image: this.state.imgList.length > 0 ? this.state.imgList[0] : null,
        typeSampling: values.typeSampling,
        isStopWorking: values.isStopWorking,
        website: values.website,
        capacity: values.capacity,
        career: values.career,
        material: values.material,
        processProduction: values.processProduction,
        yearOperate: values.yearOperate,
        userResponsible: values.userResponsible,
        userSupervisor: values.userSupervisor,
        phoneResponsible: get(values, 'phoneResponsible'),
        phoneSupervisor: get(values, 'phoneSupervisor'),
        order: '',
        lostConnection: this._transformLostConnectionData(values),
      }
      const { t } = this.props.lang
      // console.log(data.measuringList, '---data---')
      // console.log(data, '---data---')
      const isDisableSave = data.measuringList.some(measuring => {
        const { minLimit, maxLimit, minTend, maxTend } = measuring
        if (!_.isNil(maxLimit) && !_.isNil(maxTend) && maxTend >= maxLimit) {
          message.error(t('stationAutoManager.form.errorMaxTend'))
          return true
        }
        if (!_.isNil(minTend) && !_.isNil(minLimit) && minTend <= minLimit) {
          message.error(t('stationAutoManager.form.errorMinTend'))
          return true
        }
        if (!_.isNil(minLimit) && !_.isNil(maxLimit) && minLimit >= maxLimit) {
          message.error(t('stationAutoManager.form.errorMinMax'))
          return true
        }
        if (!_.isNil(minTend) && !_.isNil(maxTend) && minTend >= maxTend) {
          message.error(t('stationAutoManager.form.errorMinMax'))
          return true
        }
        return false
      })

      // Callback submit form Container Component
      if (!isDisableSave && this.props.onSubmit) {
        this.props.onSubmit(data)
      }
    })
  }

  changeStationType(stationTypeObject) {
    this.props.form.setFieldsValue({ stationType: stationTypeObject.key })
    this.setState({
      stationType: stationTypeObject.key,
      stationTypeObject: stationTypeObject,
    })
  }

  changeProvince(provinceObject) {
    this.props.form.setFieldsValue({ province: provinceObject.key })
    this.setState({
      province: provinceObject.key,
      provinceObject: provinceObject,
    })
  }

  changeQCVN(standardsVNObject) {
    // console.log(standardsVNObject, 'standardsVNObject')
    const value = get(standardsVNObject, 'key', null)
    this.props.form.setFieldsValue({ standardsVN: value })

    this.setState({
      standardsVN: value,
      isStandardsVN: true,
      standardsVNObject: standardsVNObject ? standardsVNObject : null,
    })
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handleImageChange = ({ fileList, file, event }) => {
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].response) fileList[i].status = 'done'
      else fileList[i].status = 'uploading'
    }

    const imgList = this.state.fileList
      .filter(img => img.response)
      .map(img => img.response)

    if (file.response !== null && imgList.length > 0) {
      this.setState({
        fileList: fileList,
        imgList: imgList,
      })
    }

    //error
    if (file.status === 'error') {
      const { t } = this.props.lang
      fileList = []
      swal({
        title: t('stationAutoManager.upload.error'),
        type: 'error',
      })
    }

    this.setState({ fileList: fileList })
  }

  handleEmailsChange(value) {
    this.setState({
      emails: value,
    })
  }
  handlePhonesChange(value) {
    this.setState({
      phones: value,
    })
  }

  handleChange(listKey, ae) {
    this.setState({
      tabKey: listKey.length > 0 ? listKey[listKey.length - 1] : listKey,
    })
  }

  handleOnChangeMeasuring = dataMeasuring => {
    // console.log(dataMeasuring, '--handleOnChangeMeasuring')
    this.setState({
      measuringList: dataMeasuring,
    })
  }

  onChangeStandardsVN = value => {
    this.setState({
      isStandardsVN: value,
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { otherForm } = this.props
    const { t } = this.props.lang
    // const urlPhotoUpload = MediaApi.urlPhotoUploadWithDirectory('station-autos')
    // const { previewVisible, previewImage, fileList } = this.state
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">
    //       {t('stationAutoManager.upload.label')}
    //     </div>
    //   </div>
    // )
    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 0 },
      },
      wrapperCol: {
        sm: { span: 17, offset: 0 },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Collapse
          onChange={this.handleChange}
          activeKey={this.state.tabKey}
          defaultActiveKey={otherForm ? ['1', '2'] : ['1']}
        >
          <Panel
            id="form1"
            header={t('stationAutoManager.form.panel1')}
            key="1"
          >
            {/* <Tabs
              defaultActiveKey="1"
              activeKey={this.state.tabKey}
              onChange={this.handleChangeTab}
            >
              <TabPane tab="Thông tin chung" key="1"></TabPane>
              <TabPane tab="Chỉ tiêu" key="2"></TabPane>
            </Tabs> */}
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.key.label')}
                >
                  {getFieldDecorator('key', {
                   rules: [
                    {
                      required: true,
                      message: i18n.key.required,
                    },
                    {
                      pattern: PATTERN_KEY,
                      message: i18n.key.pattern,
                    },
                    {
                      max: 64,
                      message: i18n.key.max,
                    },
                  ],
                  })(
                    <Input
                      disabled={this.props.isEdit}
                      placeholder={t('stationAutoManager.form.key.placeholder')}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.name.label')}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: i18n.name.required,
                      },
                      {
                        pattern: PATTERN_NAME,
                        message: i18n.name.pattern,
                      },
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.name.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.province.label')}
                >
                  {getFieldDecorator('province', {
                    rules: [
                      {
                        required: false,
                        message: t('stationAutoManager.form.province.error'),
                      },
                    ],
                  })(
                    <SelectProvice
                      //  label={t('stationAutoManager.form.province.label')}
                      placeholder={t(
                        'stationAutoManager.form.province.placeholder'
                      )}
                      onHandleChange={this.changeProvince}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.qcvn.label')}
                >
                  {getFieldDecorator('standardsVN', {
                    rules: [
                      {
                        required: false,
                        message: t('stationAutoManager.form.qcvn.error'),
                      },
                    ],
                  })(
                    <SelectQCVN
                      placeholder={t(
                        'stationAutoManager.form.qcvn.placeholder'
                      )}
                      onHandleChange={this.changeQCVN}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.long.label')}
                >
                  {getFieldDecorator('long', {
                    rules: [
                      {
                        required: true,
                        message: t('stationAutoManager.form.long.error'),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ flex: 1, width: '100%' }}
                      placeholder={t(
                        'stationAutoManager.form.long.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.lat.label')}
                >
                  {getFieldDecorator('lat', {
                    rules: [
                      {
                        required: true,
                        message: t('stationAutoManager.form.lat.error'),
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ flex: 1, width: '100%' }}
                      placeholder={t('stationAutoManager.form.lat.placeholder')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.address.label')}
                >
                  {getFieldDecorator('address')(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.address.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.stationType.label')}
                >
                  {getFieldDecorator('stationType', {
                    rules: [
                      {
                        required: true,
                        message: t('stationAutoManager.form.stationType.error'),
                      },
                    ],
                  })(
                    <SelectStationType
                      label={t('stationAutoManager.form.stationType.label')}
                      placeholder={t(
                        'stationAutoManager.form.stationType.placeholder'
                      )}
                      onHandleChange={this.changeStationType}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.frequency.label')}
                >
                  {getFieldDecorator('dataFrequency', {
                    rules: [{ required: false }],
                  })(
                    <InputNumberCell
                      editable={true}
                      size="small"
                      min={1}
                      max={1000000}
                    />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.typeSampling.label')}
                >
                  {getFieldDecorator('typeSampling', {
                    rules: [],
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="FTP">FTP</Radio.Button>
                      <Radio.Button value="INVENTIA">INVENTIA</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col> */}
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.dayOfOperation.label')}
                >
                  {getFieldDecorator('activatedAt', {
                    rules: [{ required: false }],
                  })(
                    <DatePicker
                      format="DD-MM-YYYY"
                      placeholder={t(
                        'stationAutoManager.form.dayOfOperation.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.isStopWorking.label')}
                >
                  {getFieldDecorator('isStopWorking', {
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </FormItem>
              </Col> */}
            </Row>
            <ConnectionStatusWrapper>
              <div style={{ width: '43em' }}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.connectionStatus.label')}
                  style={{ color: 'red ', marginLeft: '12px' }}
                >
                  {getFieldDecorator('connectionStatusNumber', {
                    rules: [
                      {
                        required: true,
                        message: t(
                          'stationAutoManager.form.connectionStatus.error'
                        ),
                      },
                    ],
                  })(<InputNumber min={1} initialValue={1} />)}
                </FormItem>
              </div>

              <div style={{ marginLeft: '-24em' }}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('connectionStatusTimeRange', {
                    rules: [
                      {
                        required: true,
                        message: t(
                          'stationAutoManager.form.connectionStatus.error'
                        ),
                      },
                    ],
                  })(
                    <Select
                      placeholder={t(
                        'stationAutoManager.form.connectionStatus.label'
                      )}
                      style={{ width: 120 }}
                    >
                      <Option value="MINUTES">
                        {t(
                          'stationAutoManager.form.connectionStatus.time.options.minutes'
                        )}
                      </Option>
                      <Option value="HOURS">
                        {t(
                          'stationAutoManager.form.connectionStatus.time.options.hours'
                        )}
                      </Option>
                      <Option value="DAYS">
                        {t(
                          'stationAutoManager.form.connectionStatus.time.options.days'
                        )}
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              <i
                style={{
                  marginTop: '14px',
                  marginLeft: '8px',
                }}
              >
                {t('stationAutoManager.form.connectionStatus.description')}
              </i>
            </ConnectionStatusWrapper>
            <Row gutter={8}>
              {/* <Col span={24} style={{ paddingRight: 40 }}>
                <FormItem
                  {...formItemLayout}
                  labelCol={{
                    sm: { span: 3, offset: 0 },
                  }}
                  wrapperCol={{
                    sm: { span: 21, offset: 0 },
                  }}
                  label={t('stationAutoManager.form.emails.label')}
                >
                  {getFieldDecorator(
                    'emails',
                    {}
                  )(
                    <Select
                      mode="tags"
                      placeholder={t(
                        'stationAutoManager.form.emails.placeholder'
                      )}
                      onChange={this.handleEmailsChange}
                    />
                  )}
                  <i>{t('stationAutoManager.form.emails.description')}</i>
                </FormItem>
              </Col> */}
              <Col
                span={12}
                style={{
                  display: 'none',
                }}
              >
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.phones.label')}
                >
                  {getFieldDecorator(
                    'phones',
                    {}
                  )(
                    <Select
                      mode="tags"
                      placeholder={t(
                        'stationAutoManager.form.phones.placeholder'
                      )}
                      onChange={this.handlePhonesChange}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24} style={{ paddingRight: 40 }}>
                <FormItem
                  {...formItemLayout}
                  labelCol={{
                    sm: { span: 3, offset: 0 },
                  }}
                  wrapperCol={{
                    sm: { span: 21, offset: 0 },
                  }}
                  label={t('stationAutoManager.form.note.label')}
                >
                  {getFieldDecorator('note')(
                    <TextArea
                      placeholder={t(
                        'stationAutoManager.form.note.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24} />
            </Row>
          </Panel>
          <Panel header={t('stationAutoManager.form.panel3')} key="3">
            {this.state.measuringListSource &&
              this.state.measuringListSource.length > 0 &&
              this.state.tabKey.indexOf('3') >= 0 && (
                <MeasuringTable
                  onChangeMeasuring={this.handleOnChangeMeasuring}
                  isEdit={this.props.isEdit}
                  lang={this.props.lang}
                  form={this.props.form}
                  isStandardsVN={this.state.isStandardsVN}
                  onChangeStandardsVN={this.onChangeStandardsVN}
                  standardsVN={get(
                    this.state.standardsVNObject,
                    'measuringList',
                    []
                  )}
                  dataSource={
                    this.state.measuringList
                      ? this.state.measuringList
                      : [
                          {
                            key: '',
                            name: '',
                            unit: '',
                          },
                        ]
                  }
                  measuringListSource={this.state.measuringListSource}
                />
              )}
          </Panel>
          <Panel header={t('stationAutoManager.form.panel2')} key="2">
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.website.label')}
                >
                  {getFieldDecorator(
                    'website',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.website.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.capacity.label')}
                >
                  {getFieldDecorator(
                    'capacity',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.capacity.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.career.label')}
                >
                  {getFieldDecorator(
                    'career',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.career.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.yearOperate.label')}
                >
                  {getFieldDecorator(
                    'yearOperate',
                    {}
                  )(
                    <InputNumberCell
                      editable={true}
                      size="small"
                      min={1800}
                      max={2050}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.userResponsible.label')}
                >
                  {getFieldDecorator(
                    'userResponsible',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.userResponsible.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.phoneResponsible.label')}
                >
                  {getFieldDecorator(
                    'phoneResponsible',
                    {}
                  )(<InputPhoneNumber size="medium" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.userSupervisor.label')}
                >
                  {getFieldDecorator(
                    'userSupervisor',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.userSupervisor.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={t('stationAutoManager.form.phoneSupervisor.label')}
                >
                  {getFieldDecorator(
                    'phoneSupervisor',
                    {}
                  )(<InputPhoneNumber size="medium" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24} style={{ paddingRight: 40 }}>
                <FormItem
                  {...formItemLayout}
                  labelCol={{
                    sm: { span: 3, offset: 0 },
                  }}
                  wrapperCol={{
                    sm: { span: 21, offset: 0 },
                  }}
                  label={t('stationAutoManager.form.material.label')}
                >
                  {getFieldDecorator(
                    'material',
                    {}
                  )(
                    <Input
                      placeholder={t(
                        'stationAutoManager.form.material.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24} style={{ paddingRight: 40 }}>
                <FormItem
                  {...formItemLayout}
                  labelCol={{
                    sm: { span: 3, offset: 0 },
                  }}
                  wrapperCol={{
                    sm: { span: 21, offset: 0 },
                  }}
                  label={t('stationAutoManager.form.processProduction.label')}
                >
                  {getFieldDecorator(
                    'processProduction',
                    {}
                  )(
                    <TextArea
                      placeholder={t(
                        'stationAutoManager.form.processProduction.placeholder'
                      )}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <FormItem>
          <Button
            style={{ width: '100%' }}
            type="primary"
            loading={this.props.isLoading}
            htmlType="submit"
          >
            {t('addon.save')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
