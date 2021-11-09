import React from 'react'
import PropTypes from 'prop-types'
// import styled from "styled-components";
import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  // InputNumber,
  Icon,
  Popconfirm,
  Spin,
  Select,
  Checkbox,
} from 'antd'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import { getMeasurings, getConfigAqiQC, postConfigAqiQC } from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

function i18n() {
  return {
    submit: translate('addon.save'),
    warning: translate('addon.warning'),
    refresh: translate('addon.refresh'),
    yes: translate('add.yes'),
    cancel: translate('addon.cancel'),
    confirmMsgDelete: translate('confirm.msg.delete'),
    updateSuccess: translate('addon.onSave.update.success'),
    updateError: translate('addon.onSave.update.error'),

    add: translate('aqiConfigCalculation.add'),
    errorDuplicate: translate(
      'aqiConfigCalculation.error.MEASURE_KEY_DUPLICATE'
    ),
    required1D_1H: translate('aqiConfigCalculation.required1D_1H'),
    required: translate('aqiConfigCalculation.required'),
    colLevel: translate('aqiConfigCalculation.colLevel'),
    colMin: translate('aqiConfigCalculation.colMin'),
    colMax: translate('aqiConfigCalculation.colMax'),
    colColor: translate('aqiConfigCalculation.colColor'),
    colDescription: translate('aqiConfigCalculation.colDescription'),

    colMeasureKey: translate('aqiConfigCalculation.colMeasureKey'),
    colMeasure: translate('aqiConfigCalculation.colMeasure'),
    colBatBuoc: translate('aqiConfigCalculation.colBatBuoc'),
    colAvg1H: translate('aqiConfigCalculation.colAvg1H'),
    colAvg8H: translate('aqiConfigCalculation.colAvg8H'),
    colAvg1D: translate('aqiConfigCalculation.colAvg1D'),
    colUnit: translate('aqiConfigCalculation.colUnit'),
  }
}

@Form.create({})
export default class TabThongSo extends React.Component {
  static propTypes = {
    keyQc: PropTypes.string,
  }

  idIncrement = 0
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: [],
    dataMeasuringObj: {},
    aqiQCLevel: [],
  }
  columns = [
    {
      title: i18n().colMeasureKey,
      dataIndex: 'viewMeasure',
      key: 'viewMeasure',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form
        const aqiQCMeasures = getFieldValue(
          `aqiQCMeasures[${record.key}].keyMeasure`
        )
        return aqiQCMeasures
      },
    },
    {
      title: i18n().colMeasure,
      dataIndex: 'selectMeasure',
      key: 'selectMeasure',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`aqiQCMeasures[${record.key}].keyMeasure`, {
              rules: [
                {
                  required: true,
                  message: i18n().required,
                },
              ],
            })(
              <Select {...this.props} showSearch style={{width: '100%'}}>
                {_.map(this.state.dataMeasuringObj, mea => {
                  const isDisable = this.state.dataSource.some(
                    item => item.keyMeasure === mea.key
                  )
                  return (
                    <Select.Option disabled={isDisable} key={mea.key} value={mea.key}>
                      {mea.name}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().colBatBuoc,
      dataIndex: 'isrequired',
      key: 'isrequired',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`aqiQCMeasures[${record.key}].isrequired`, {
              onChange: val => {
                const { setFieldsValue, getFieldValue } = this.props.form
                setFieldsValue({
                  [`aqiQCMeasures[${record.key}].isrequired`]: getFieldValue(
                    `aqiQCMeasures[${record.key}].isrequired`
                  ),
                })
              },
            })(
              <Checkbox
                disabled={!getFieldValue(
                  `aqiQCMeasures[${record.key}].keyMeasure`
                )}
                checked={getFieldValue(
                  `aqiQCMeasures[${record.key}].isrequired`
                )}
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().colAvg1H,
      dataIndex: '1h',
      key: '1h',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`aqiQCMeasures[${record.key}].1h`, {
              onChange: val => {
                const { setFieldsValue, getFieldValue } = this.props.form
                setFieldsValue({
                  [`aqiQCMeasures[${record.key}].1h`]: getFieldValue(
                    `aqiQCMeasures[${record.key}].1h`
                  ),
                })
              },
            })(
              <Checkbox
                disabled={!getFieldValue(
                  `aqiQCMeasures[${record.key}].keyMeasure`
                )}
                checked={getFieldValue(`aqiQCMeasures[${record.key}].1h`)}
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().colAvg8H,
      dataIndex: '8h',
      key: '8h',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`aqiQCMeasures[${record.key}].8h`, {
              onChange: val => {
                const { setFieldsValue, getFieldValue } = this.props.form
                setFieldsValue({
                  [`aqiQCMeasures[${record.key}].8h`]: getFieldValue(
                    `aqiQCMeasures[${record.key}].8h`
                  ),
                })
              },
            })(
              <Checkbox
                disabled={!getFieldValue(
                  `aqiQCMeasures[${record.key}].keyMeasure`
                )}
                checked={getFieldValue(`aqiQCMeasures[${record.key}].8h`)}
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().colAvg1D,
      dataIndex: '24h',
      key: '24h',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`aqiQCMeasures[${record.key}].24h`, {
              onChange: val => {
                const { setFieldsValue, getFieldValue } = this.props.form
                setFieldsValue({
                  [`aqiQCMeasures[${record.key}].24h`]: getFieldValue(
                    `aqiQCMeasures[${record.key}].24h`
                  ),
                })
              },
            })(
              <Checkbox
                disabled={!getFieldValue(
                  `aqiQCMeasures[${record.key}].keyMeasure`
                )}
                checked={getFieldValue(`aqiQCMeasures[${record.key}].24h`)}
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().colUnit,
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form
        const aqiQCMeasures = getFieldValue('aqiQCMeasures')
        const key = _.get(aqiQCMeasures, `${record.key}.keyMeasure`)
        return _.get(this.state.dataMeasuringObj, `${key}.unit`)
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record, index) => {
        return (
          <Popconfirm
            onConfirm={this.delete.bind(this, record.key)}
            // onCancel={cancel}
            title={i18n().confirmMsgDelete}
            okText={i18n().yes}
            cancelText={i18n().cancel}
            placement="left"
          >
            <Icon
              type="delete"
              style={{ color: 'red', fontSize: 24, cursor: 'pointer' }}
            />
          </Popconfirm>
        )
      },
    },
  ]

  SelectMeasure = React.forwardRef(props => {
    // console.log(props,"SelectMeasure")
    return (
      <Select {...props} showSearch style={{ width: '100%' }}>
        {_.map(this.state.dataMeasuringObj, mea => {
          const isDisable = this.state.dataSource.some(
            item => item.keyMeasure === mea.key
          )
          return (
            <Select.Option disabled={isDisable} key={mea.key} value={mea.key}>
              {mea.name}
            </Select.Option>
          )
        })}
      </Select>
    )
  })

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true })
        console.log('Received values of form: ', values)
        try {
          // check logic add duplicate parameter
          const aqiQCMeasuresValue = _.get(values, 'aqiQCMeasures', []).filter(
            item => Object.keys(item).length > 1
          )
          const uniqueAqiQCMeasuresValue = _.uniqBy(
            aqiQCMeasuresValue,
            'keyMeasure'
          )
          if (aqiQCMeasuresValue.length !== uniqueAqiQCMeasuresValue.length) {
            message.error(i18n().errorDuplicate)
            return
          }
          //
          let transformData = _.get(values, 'aqiQCMeasures', []).filter(
            i =>
              (_.identity(i['1h']) ||
                _.identity(i['8h']) ||
                _.identity(i['24h']) ||
                _.identity(i['isrequired'])) &&
              _.identity(i.keyMeasure)
          )

          const response = await postConfigAqiQC(this.props.keyQc, {
            aqiQCLevel: this.state.aqiQCLevel,
            aqiQCMeasures: _.keyBy(transformData, 'keyMeasure'),
          })
          if (response.success) {
            message.success(i18n().updateSuccess)
          }
        } finally {
          this.setState({ isSubmit: false })
        }
      }
    })
  }

  add = () => {
    this.setState({
      dataSource: [
        ...this.state.dataSource,
        {
          key: this.idIncrement++,
        },
      ],
    })
  }

  delete = key => {
    let tamp = this.state.dataSource.filter(item => item.key !== key)
    this.setState({
      dataSource: [...tamp],
    })
  }

  async componentDidMount() {
    let dataMeasuringObj = {}
    const resMeasuringList = await getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )
    if (resMeasuringList.success) {
      dataMeasuringObj = _.keyBy(resMeasuringList.data, 'key')
    }

    const response = await getConfigAqiQC(this.props.keyQc)
    if (response.success) {
      let transformData = _.get(response, 'data.value.aqiQCMeasures', {})
      // console.log(transformData, "transformData");
      let dataSource = _.map(transformData, item => {
        return {
          ...item,
          key: this.idIncrement++,
          keyMeasure: item.keyMeasure,
        }
      })
      this.setState(
        {
          dataMeasuringObj,
          aqiQCLevel: _.get(response, 'data.value.aqiQCLevel', []),
          dataSource: dataSource,
          isLoaded: true,
        },
        () => {
          // console.log(dataSource, "dataSource");
          this.props.form.setFieldsValue({
            aqiQCMeasures: dataSource,
          })
        }
      )
    }
  }

  componentDidUpdate(){
    const {isDisable} = this.state
    const isValid = this.validateForm()
    if(isValid !== isDisable) this.setState({isDisable: isValid})
  }

  validateForm(){
    const {form} = this.props
    const formValues = form.getFieldsValue()
    const aqiQCMeasures = _.get(formValues, 'aqiQCMeasures', []);

    const record = aqiQCMeasures.find((item) => {
      if(!item.keyMeasure) return true
      if(['1h', '8h', '24h', 'isrequired'].every(key => !_.identity(item[key]))) return true
      return false
    })

    return !!record
  }

 render() {
   const {isDisable} = this.state
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Button type="primary" onClick={this.add}>
          {i18n().add}
        </Button>
        <Clearfix height={16} />
        <Table
          size="small"
          bordered
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={false}
        />
        <Clearfix height={16} />
        <Button
          loading={this.state.isSubmit}
          block
          type="primary"
          onClick={this.submit}
          disabled={isDisable}
        >
          {i18n().submit}
        </Button>
      </Spin>
    )
  }
}
