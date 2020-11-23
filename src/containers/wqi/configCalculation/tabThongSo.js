import React from 'react'
// import PropTypes from "prop-types";
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
  Row,
  Col,
} from 'antd'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import {
  getMeasurings,
  getConfigWqiParams,
  postConfigWqiParams,
} from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

const { Option } = Select

const i18n = {
  submit: translate('addon.save'),
  warning: translate('addon.warning'),
  refresh: translate('addon.refresh'),
  yes: translate('add.yes'),
  cancel: translate('addon.cancel'),
  confirmMsgDelete: translate('confirm.msg.delete'),
  updateSuccess: translate('addon.onSave.update.success'),
  updateError: translate('addon.onSave.update.error'),

  add: translate('wqiConfigCalculation.add'),
  required1D_1H: translate('wqiConfigCalculation.required1D_1H'),
  required: translate('wqiConfigCalculation.required'),
  colLevel: translate('wqiConfigCalculation.colLevel'),
  colMin: translate('wqiConfigCalculation.colMin'),
  colMax: translate('wqiConfigCalculation.colMax'),
  colColor: translate('wqiConfigCalculation.colColor'),
  colDescription: translate('wqiConfigCalculation.colDescription'),

  colMeasureKey: translate('wqiConfigCalculation.colMeasureKey'),
  colMeasure: translate('wqiConfigCalculation.colMeasure'),
  colBatBuoc: translate('wqiConfigCalculation.colBatBuoc'),
  colAvg1H: translate('wqiConfigCalculation.colAvg1H'),
  colAvg8H: translate('wqiConfigCalculation.colAvg8H'),
  colAvg1D: translate('wqiConfigCalculation.colAvg1D'),
  colUnit: translate('wqiConfigCalculation.colUnit'),

  colGroupI: translate('wqiConfigCalculation.colGroupI'),
  colGroupII: translate('wqiConfigCalculation.colGroupII'),
  colGroupIII: translate('wqiConfigCalculation.colGroupIII'),
  colGroupIV: translate('wqiConfigCalculation.colGroupIV'),
  colGroupV: translate('wqiConfigCalculation.colGroupV'),
  colBelongTemp: translate('wqiConfigCalculation.colBelongTemp'),
  colGroupParam: translate('wqiConfigCalculation.colGroupParam'),
}

@Form.create({})
export default class TabThongSo extends React.Component {
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
      title: i18n.colMeasureKey,
      dataIndex: 'viewMeasure',
      key: 'viewMeasure',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form
        const aqiQCMeasures = getFieldValue(`payload[${record.key}].keyMeasure`)
        return aqiQCMeasures
      },
    },
    {
      title: i18n.colMeasure,
      dataIndex: 'keyMeasure',
      key: 'keyMeasure',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`payload[${record.key}].keyMeasure`, {
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(<this.SelectMeasure />)}
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colGroupParam,
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`payload[${record.key}].group`, {
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                <Option value="groupI">{i18n.colGroupI}</Option>
                <Option value="groupII">{i18n.colGroupII}</Option>
                <Option value="groupIII">{i18n.colGroupIII}</Option>
                <Option value="groupIV">{i18n.colGroupIV}</Option>
                <Option value="groupV">{i18n.colGroupV}</Option>
              </Select>
            )}
          </Form.Item>
        )
      },
    },
    // {
    //   title: i18n.colBatBuoc,
    //   dataIndex: 'isrequired',
    //   key: 'isrequired',
    //   align: 'center',
    //   width: 80,
    //   render: (text, record, index) => {
    //     const { getFieldDecorator } = this.props.form
    //     return (
    //       <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
    //         {getFieldDecorator(`payload[${record.key}].isrequired`, {
    //           valuePropName: 'checked',
    //         })(
    //           <Checkbox style={{ display: 'flex', justifyContent: 'center' }} />
    //         )}
    //       </Form.Item>
    //     )
    //   },
    // },
    {
      title: i18n.colBelongTemp,
      dataIndex: 'belongTemp',
      key: 'belongTemp',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const isCheckedBelong = getFieldValue(
          `payload[${record.key}].isBelongTemp`
        )
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {getFieldDecorator(`payload[${record.key}].isBelongTemp`, {
              valuePropName: 'checked',
            })(<Checkbox style={{ marginRight: 8 }} />)}

            <Form.Item
              style={{
                textAlign: 'left',
                marginBottom: 'initial',
                width: '100%',
                flex: 1,
              }}
            >
              {getFieldDecorator(`payload[${record.key}].belongTemp`, {
                rules: [
                  {
                    required: isCheckedBelong,
                    message: i18n.required,
                  },
                ],
              })(<this.SelectMeasure disabled={!isCheckedBelong} />)}
            </Form.Item>
          </div>
        )
      },
    },
    {
      title: i18n.colUnit,
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form
        const payload = getFieldValue('payload')
        const key = _.get(payload, `${record.key}.keyMeasure`)
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
            title={i18n.confirmMsgDelete}
            okText={i18n.yes}
            cancelText={i18n.cancel}
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

  SelectMeasure = React.forwardRef((props, ref) => {
    return (
      <Select ref={ref} {...props} showSearch style={{ width: '100%' }}>
        {_.map(this.state.dataMeasuringObj, mea => {
          return (
            <Select.Option key={mea.key} value={mea.key}>
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
          let transformData = values.payload
          const response = await postConfigWqiParams(
            this.props.code,
            transformData
          )
          if (response.success) {
            message.success(i18n.updateSuccess)
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

    const response = await getConfigWqiParams(this.props.code)
    if (response.success) {
      let transformData = _.get(response, 'data.value', [])
      transformData = transformData.filter(item => item != null)
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
          dataSource: dataSource,
          isLoaded: true,
        },
        () => {
          this.props.form.setFieldsValue({
            payload: transformData,
          })
        }
      )
    }
  }

  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Clearfix height={16} />
        <Table
          size="small"
          bordered
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={false}
        />
        <Clearfix height={16} />
        <Row gutter={12}>
          <Col xs={12}>
            <Button block type="primary" onClick={this.add}>
              {i18n.add}
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              loading={this.state.isSubmit}
              block
              type="primary"
              onClick={this.submit}
            >
              {i18n.submit}
            </Button>
          </Col>
        </Row>
      </Spin>
    )
  }
}
