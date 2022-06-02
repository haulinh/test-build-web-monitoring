import { Col, Form, Icon, Row, Switch, Table } from 'antd'
import { i18n } from 'containers/alarm/AlarmSetting/constants'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { get, isEqual, keyBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

@Form.create()
@withRouter
@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
export default class TableQCVN extends Component {
  componentDidMount = () => {
    this.handleMeasuringListEnable()
  }

  componentDidUpdate(prevProps) {
    const { measureListValue, dataSource } = this.props

    if (!isEqual(prevProps.measureListValue, measureListValue)) {
      this.handleMeasuringListEnable()
    }

    if (!isEqual(prevProps.dataSource, dataSource)) {
      this.handleMeasuringListEnable()
    }
  }

  handleMeasuringListEnable = () => {
    const { form, measureListValue, dataSource } = this.props

    const measureListValueObject = dataSource.reduce((base, current) => {
      if (measureListValue.includes(current.key))
        return { ...base, [current.key]: true }

      return { ...base, [current.key]: false }
    }, {})

    form.setFieldsValue({ measuringListEnable: measureListValueObject })
  }

  getStandardColumns = () => {
    const { qcvnList } = this.props
    const columns = qcvnList.map(qcvn => {
      const measuringQcvnObj = keyBy(qcvn.measuringList, 'key')

      return {
        title: (
          <Row gutter={10} type="flex" justify="center" align="center">
            <Col>{qcvn.name}</Col>
          </Row>
        ),
        key: qcvn.key,
        align: 'center',
        dataIndex: 'key',
        render: measureKey => {
          const measureValueMin = get(measuringQcvnObj, [
            measureKey,
            `minLimit`,
          ])
          const measureValueMax = get(measuringQcvnObj, [
            measureKey,
            `maxLimit`,
          ])
          return (
            <Row type="flex" justify="center">
              <Col span={10}>
                <div>{measureValueMin ? measureValueMin : '-'}</div>
              </Col>
              <Col span={2}>
                <Icon type="arrow-right" style={{ fontSize: '12px' }} />
              </Col>
              <Col span={10}>
                <div>{measureValueMax ? measureValueMax : '-'}</div>
              </Col>
            </Row>
          )
        },
      }
    })

    return columns
  }

  getDefaultDataLevelColumns = () => {
    const { measuringListStation, defaultDataLevelValue } = this.props

    const defaultDataLevels = [
      {
        title: get(defaultDataLevelValue, `${FIELDS.EXCEED}.config.name`),
        dataIndex: 'Limit',
      },
      {
        title: get(
          defaultDataLevelValue,
          `${FIELDS.EXCEED_PREPARING}.config.name`
        ),
        dataIndex: 'Tend',
      },
    ]

    const measuringStationObj = keyBy(measuringListStation, 'key')
    const defaultDataLevelColumns = defaultDataLevels.map(level => ({
      title: (
        <Row gutter={10} type="flex" justify="center" align="center">
          <Col>{level.title}</Col>
        </Row>
      ),
      key: level.dataIndex,
      align: 'center',
      dataIndex: 'key',
      render: measureKey => {
        const measureValueMin = get(measuringStationObj, [
          measureKey,
          `min${level.dataIndex}`,
        ])
        const measureValueMax = get(measuringStationObj, [
          measureKey,
          `max${level.dataIndex}`,
        ])
        return (
          <Row type="flex" justify="center">
            <Col span={10}>
              <div>{measureValueMin ? measureValueMin : '-'}</div>
            </Col>
            <Col span={2}>
              <Icon type="arrow-right" style={{ fontSize: '12px' }} />
            </Col>
            <Col span={10}>
              <div>{measureValueMax ? measureValueMax : '-'}</div>
            </Col>
          </Row>
        )
      },
    }))

    return defaultDataLevelColumns
  }

  getColumns = () => {
    const { measuresObj } = this.props
    const standardColumns = this.getStandardColumns()
    const defaultDataLevelColumns = this.getDefaultDataLevelColumns()

    return [
      {
        title: i18n().measure,
        key: 'measure',
        dataIndex: 'key',
        align: 'left',
        width: '10%',
        render: measureKey => <div>{measuresObj[measureKey].name}</div>,
      },
      ...defaultDataLevelColumns,
      ...standardColumns,
      {
        title: i18n().alarm,
        align: 'center',
        key: 'enable',
        dataIndex: 'key',
        render: measureKey => {
          const { form } = this.props
          return (
            <React.Fragment>
              {form.getFieldDecorator(`measuringListEnable.${measureKey}`, {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch />)}
            </React.Fragment>
          )
        },
      },
    ]
  }

  render() {
    const { dataSource } = this.props

    return (
      <Table
        columns={this.getColumns()}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    )
  }
}
