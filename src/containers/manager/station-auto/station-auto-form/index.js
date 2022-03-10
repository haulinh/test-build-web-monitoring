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
  Select,
} from 'antd'
import CategoryApi from 'api/CategoryApi'
import { Clearfix } from 'components/elements'
import InputNumberCell from 'components/elements/input-number-cell'
import InputPhoneNumber from 'components/elements/input-phone-number'
import SelectProvice from 'components/elements/select-province'
import SelectQCVN from 'components/elements/select-qcvn'
import SelectStationFix from 'components/elements/select-station-fixed'
import SelectStationType from 'components/elements/select-station-type'
import { HeaderSearch, Title } from 'components/layouts/styles'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import { autobind } from 'core-decorators'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import _, { get, omit } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
// import { mapPropsToFields } from 'utils/form'
import styled from 'styled-components'
// import MediaApi from 'api/MediaApi'
import swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import AlarmConfig from '../alarm-config'
import MeasuringTableAdvanced from '../station-auto-formTable-advanced/'
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

function i18n() {
  return {
    key: {
      required: translate('stationAutoManager.form.key.required'),
      pattern: translate('stationAutoManager.form.key.pattern'),
      max: translate('stationAutoManager.form.key.max'),
    },
    name: {
      required: translate('stationAutoManager.form.name.required'),
      pattern: translate('stationAutoManager.form.name.pattern'),
      max: translate('stationAutoManager.form.name.max'),
    },
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
      measuringListAdvanced: [],
      measuringListSourceAdvanced: [],
      measuringOps: [],
      options: {},
      phones: [],
      emails: [],
      linkedStation: '',
      standardsVNObject: get(props, 'initialValues.standardsVN', null),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imgList: [],
      allowUpdateStandardsVN: props.isEdit,
      tabKey: ['1'],
      isStandardsVN: false,
      stationAutoSelects: [],
      isOnChangeMeasuringUnit: false,
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
    if (initialValues.mapLocationVN2000) {
      initialValues = {
        ...initialValues,
        latVn2000: _.get(initialValues, 'mapLocationVN2000.lat', null),
        longVn2000: _.get(initialValues, 'mapLocationVN2000.long', null),
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

    const initialValues = this.getInitialValues()
    let initialMeasuringListSourceAdvanced

    if (initialValues.measuringList) {
      initialMeasuringListSourceAdvanced = measuringList.data.filter(
        measuring => {
          return initialValues.measuringList.some(
            element => element.key === measuring.key
          )
        }
      )
    } else {
      initialMeasuringListSourceAdvanced = []
    }

    this.setState({
      measuringListSource: measuringList.data,
      measuringListSourceAdvanced: initialMeasuringListSourceAdvanced,
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

    let measuringListAdvancedMapped = []
    let measuringListMapped = []
    if (initialValues.measuringList) {
      measuringListMapped = initialValues.measuringList.map(measuring => {
        return {
          ...measuring,
          id: uuidv4(),
        }
      })
    }
    if (initialValues.measuringListAdvanced) {
      measuringListAdvancedMapped = initialValues.measuringListAdvanced.map(
        measuringAdvanced => {
          const measuring = initialValues.measuringList.find(
            measuring => measuring.key === measuringAdvanced.key
          )
          const unitInMeasuring = _.get(measuring, 'unit')
          return {
            ...measuringAdvanced,
            unit: unitInMeasuring,
            id: uuidv4(),
          }
        }
      )
    }

    this.setState({
      emails: initialValues.emails,
      phones: initialValues.phones,
      measuringList: measuringListMapped,
      measuringListAdvanced: measuringListAdvancedMapped,
      linkedStation: initialValues.linkedStation,
      stationType: initialValues.stationType,
      stationTypeObject: initialValues.stationTypeObject,
      options: initialValues.options ? initialValues.options : {},
    })
    try {
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
        if (err.measuringListAdvanced) {
          this.setState({
            tabKey: ['4'],
          })
          return
        } else {
          this.setState({
            tabKey: ['1'],
          })
          return
        }
      }

      let measuringList = this.state.measuringList.map(
        ({ id, ...restItem }) => {
          return restItem
        }
      )
      let measuringListAdvanced = this.state.measuringListAdvanced.map(
        ({ id, ...restItem }) => {
          return restItem
        }
      )
      if (measuringListAdvanced) {
        measuringListAdvanced.forEach(
          element => (element.nameCalculate = element.nameCalculate.trim())
        )
      }
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
      }

      if (!values.linkedStation) {
        values.linkedStation = ''
      }

      const data = {
        key: values.key,
        name: (values.name || '').trim(),
        mapLocation: { long: values.long, lat: values.lat },
        mapLocationVN2000: { long: values.longVn2000, lat: values.latVn2000 },
        address: values.address,
        emails: this.state.emails,
        phones: this.state.phones,
        stationType: this.state.stationTypeObject,
        province: this.state.provinceObject,
        standardsVN: this.state.standardsVNObject,
        activatedAt: values.activatedAt,
        dataFrequency: values.dataFrequency,
        note: values.note,
        linkedStation: values.linkedStation,
        diameter: values.diameter,
        measuringList: _.compact(measuringList), // values.measuringList,
        measuringListAdvanced: _.compact(measuringListAdvanced), // values.measuringListAdvanced,
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
        let {
          minLimit,
          maxLimit,
          minTend,
          maxTend,
          minRange,
          maxRange,
        } = measuring
        minLimit = _.isNumber(minLimit) ? minLimit : null
        maxLimit = _.isNumber(maxLimit) ? maxLimit : null
        minTend = _.isNumber(minTend) ? minTend : null
        maxTend = _.isNumber(maxTend) ? maxTend : null
        minRange = _.isNumber(minRange) ? minRange : null
        maxRange = _.isNumber(maxRange) ? maxRange : null

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
          console.log('--1--')
          return true
        }

        if (!_.isNil(minTend) && !_.isNil(maxTend) && minTend >= maxTend) {
          console.log(minTend, maxTend, '---maxTend--')
          message.error(t('stationAutoManager.form.errorMinMax'))
          console.log('--2--')
          return true
        }
        if (!_.isNil(minRange) && !_.isNil(maxRange) && minRange >= maxRange) {
          message.error(t('stationAutoManager.form.errorMinMax'))
          console.log('--3--')
          return true
        }
        return false
      })

      const isDisableSaveAdvanced = data.measuringListAdvanced.some(
        measuringAdvanced => {
          if (measuringAdvanced.name === '') {
            message.error(t('stationAutoManager.form.errorAdvancedParameter'))
            return true
          }
          return false
        }
      )

      // Callback submit form Container Component
      console.log('--onSubmit---', data)
      if (!isDisableSave && !isDisableSaveAdvanced && this.props.onSubmit) {
        this.props.onSubmit(data)
        data.measuringListAdvanced.forEach((measuringAdvanced, index) => {
          this.props.form.setFieldsValue({
            [`measuringListAdvanced.${this.state.measuringListAdvanced[index].id}`]: {
              nameCalculate: measuringAdvanced.nameCalculate.trim(),
            },
          })
        })
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
    const { measuringList } = this.state
    const { form } = this.props
    const value = get(standardsVNObject, 'key', null)
    form.setFieldsValue({ standardsVN: value })

    const measuringListQCVN = get(
      standardsVNObject,
      'measuringList',
      []
    ).filter(measuringQCVN =>
      measuringList.some(measuring => measuringQCVN.key === measuring.key)
    )

    const newMeasuringList = measuringList.map(measuring => {
      const measuringChanged = measuringListQCVN.find(
        measuringQCVN => measuringQCVN.key === measuring.key
      )
      if (get(measuringChanged, 'key', '') === measuring.key) {
        return {
          ...measuring,
          minLimit: get(measuringChanged, 'minLimit', null),
          maxLimit: get(measuringChanged, 'maxLimit', null),
        }
      }
      return {
        ...measuring,
      }
    })

    this.setState({
      measuringList: newMeasuringList,
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
  handleLinkedStationChange(value) {
    this.setState({
      linkedStation: value,
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

  handleOnChangeMeasuring = (
    dataMeasuring,
    dataMeasuringAdvanced,
    dataMeasuringSource
  ) => {
    if (dataMeasuringAdvanced) {
      this.setState({
        measuringList: dataMeasuring,
        measuringListAdvanced: dataMeasuringAdvanced,
        measuringListSourceAdvanced: dataMeasuringSource,
      })
    } else {
      this.setState({
        measuringList: dataMeasuring,
      })
    }
  }

  handleOnChangeMeasuringUnit = isOnChangeMeasuringUnit => {
    this.setState({
      isOnChangeMeasuringUnit: isOnChangeMeasuringUnit,
    })
  }

  handleOnChangeMeasuringAdvanced = dataMeasuringAdvanced => {
    // console.log(dataMeasuring, '--handleOnChangeMeasuring')
    this.setState({
      measuringListAdvanced: dataMeasuringAdvanced,
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
      <div>
        <Clearfix height={32} />
        <Form onSubmit={this.handleSubmit}>
          <HeaderSearch>
            <Title>
              {t('stationAutoManager.configStationAuto.tabConfigStationAuto')}
            </Title>
          </HeaderSearch>
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
                          message: i18n().key.required,
                        },
                        {
                          pattern: PATTERN_KEY,
                          message: i18n().key.pattern,
                        },
                        {
                          max: 64,
                          message: i18n().key.max,
                        },
                      ],
                    })(
                      <Input
                        disabled={this.props.isEdit}
                        placeholder={t(
                          'stationAutoManager.form.key.placeholder'
                        )}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
                    label={t('stationAutoManager.form.name.label')}
                  >
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: i18n().name.required,
                        },
                        {
                          pattern: PATTERN_NAME,
                          message: i18n().name.pattern,
                        },
                        {
                          max: 64,
                          message: i18n().name.max,
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
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
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
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
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
                        placeholder={t(
                          'stationAutoManager.form.lat.placeholder'
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
                    label={t('stationAutoManager.form.longVn2000.label')}
                  >
                    {getFieldDecorator('longVn2000')(
                      <InputNumber
                        style={{ flex: 1, width: '100%' }}
                        placeholder={t(
                          'stationAutoManager.form.longVn2000.placeholder'
                        )}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
                    label={t('stationAutoManager.form.latVn2000.label')}
                  >
                    {getFieldDecorator('latVn2000')(
                      <InputNumber
                        style={{ flex: 1, width: '100%' }}
                        placeholder={t(
                          'stationAutoManager.form.latVn2000.placeholder'
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
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
                    label={t('stationAutoManager.form.stationType.label')}
                  >
                    {getFieldDecorator('stationType', {
                      rules: [
                        {
                          required: true,
                          message: t(
                            'stationAutoManager.form.stationType.error'
                          ),
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
                    labelCol={{
                      sm: { span: 6, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 17, offset: 0 },
                    }}
                    label={t('stationAutoManager.form.frequency.label')}
                  >
                    {getFieldDecorator('dataFrequency', {
                      rules: [{ required: false }],
                    })(
                      <InputNumber
                        style={{ width: '100%' }}
                        editable={true}
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
                    labelCol={{
                      sm: { span: 8, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 15, offset: 0 },
                    }}
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

              {/* remove config diameter */}

              {/* <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  labelCol={{
                    sm: { span: 8, offset: 0 },
                  }}
                  wrapperCol={{
                    sm: { span: 15, offset: 0 },
                  }}
                  label={t('stationAutoManager.form.diameter.label')}
                >
                  {getFieldDecorator('diameter')(
                    <InputNumber
                      placeholder={t(
                        'stationAutoManager.form.diameter.placeholder'
                      )}
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row> */}
              <ConnectionStatusWrapper>
                <div style={{ width: '44em' }}>
                  <FormItem
                    {...formItemLayout}
                    labelCol={{
                      sm: { span: 7, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 16, offset: 0 },
                    }}
                    label={t('stationAutoManager.form.connectionStatus.label')}
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

              <Row gutter={8} type="flex" justify="center">
                <Col span={11}>
                  <FormItem
                    {...formItemLayout}
                    label={t('stationAutoManager.form.linkStation.label')}
                    labelCol={{
                      sm: { span: 12, offset: 0 },
                    }}
                    wrapperCol={{
                      sm: { span: 12, offset: 0 },
                    }}
                  >
                    {getFieldDecorator('linkedStation')(
                      <SelectStationFix
                        fieldValue="key"
                        onChangeObject={this.handleLinkedStationChange()}
                      ></SelectStationFix>
                    )}
                  </FormItem>
                </Col>
                <i
                  style={{
                    paddingTop: '10px',
                    marginLeft: '8px',
                  }}
                >
                  {t('stationAutoManager.form.linkStation.description')}
                </i>
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
                    onChangeMeasuringUnit={this.handleOnChangeMeasuringUnit}
                    isEdit={this.props.isEdit}
                    lang={this.props.lang}
                    form={this.props.form}
                    isStandardsVN={this.state.isStandardsVN}
                    onChangeStandardsVN={this.onChangeStandardsVN}
                    measuringListAdvanced={this.state.measuringListAdvanced}
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
                              id: uuidv4(),
                            },
                          ]
                    }
                    measuringListSource={this.state.measuringListSource}
                  />
                )}
            </Panel>
            <Panel header={t('stationAutoManager.form.panel4')} key="4">
              <MeasuringTableAdvanced
                onChangeMeasuring={this.handleOnChangeMeasuringAdvanced}
                isEdit={this.props.isEdit}
                lang={this.props.lang}
                form={this.props.form}
                isStandardsVN={this.state.isStandardsVN}
                onChangeStandardsVN={this.onChangeStandardsVN}
                measuringList={this.state.measuringList}
                standardsVN={get(
                  this.state.standardsVNObject,
                  'measuringListAdvanced',
                  []
                )}
                dataSource={
                  this.state.measuringListAdvanced
                    ? this.state.measuringListAdvanced
                    : []
                }
                measuringListSource={this.state.measuringListSourceAdvanced}
                isOnChangeMeasuringUnit={this.state.isOnChangeMeasuringUnit}
              />
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

          <FormItem
            style={{
              marginTop: '10px',
            }}
          >
            <Button
              style={{ width: '100%' }}
              type="primary"
              loading={this.props.isLoading}
              htmlType="submit"
            >
              {t('addon.save')}
            </Button>
          </FormItem>

          <AlarmConfig isEdit={this.props.isEdit} />
        </Form>
      </div>
    )
  }
}
