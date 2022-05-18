import { Checkbox, Form, Table } from 'antd'
import { get, isEqual, keyBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { i18n } from '../constants'

@Form.create()
@withRouter
@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
export default class TableQCVN extends Component {
  componentDidUpdate(prevProps) {
    const { form, measureListValue, qcvnList } = this.props
    const measureListValueObject = measureListValue.reduce(
      (base, current) => ({ ...base, [current]: true }),
      {}
    )

    if (!isEqual(prevProps.qcvnList, qcvnList)) {
      form.setFieldsValue(measureListValueObject)
    }
  }

  getStandardColumns = () => {
    const { qcvnList } = this.props
    const columns = qcvnList.map(qcvn => {
      const measuringQcvnObj = keyBy(qcvn.measuringList, 'key')

      return {
        title: qcvn.name,
        key: qcvn.key,
        children: [
          {
            key: `minLimit-${qcvn.key}}`,
            title: i18n().qcvnMin,
            align: 'left',
            dataIndex: 'key',
            render: measureKey => {
              const measureValue = get(measuringQcvnObj, [
                measureKey,
                'minLimit',
              ])

              return <div>{measureValue}</div>
            },
          },
          {
            key: `maxLimit-${qcvn.key}}`,
            title: i18n().qcvnMax,
            dataIndex: 'key',
            render: measureKey => {
              const measureValue = get(measuringQcvnObj, [
                measureKey,
                'maxLimit',
              ])

              return <div>{measureValue}</div>
            },
            align: 'left',
          },
        ],
      }
    })

    return columns
  }

  getDefaultDataLevelColumns = () => {
    const { measuringListStation } = this.props

    const defaultDataLevels = [
      { title: i18n().exceed, dataIndex: 'Limit' },
      { title: i18n().exceed_preparing, dataIndex: 'Tend' },
    ]

    const measuringStationObj = keyBy(measuringListStation, 'key')
    const defaultDataLevelColumns = defaultDataLevels.map(level => ({
      title: level.title,
      key: level.dataIndex,
      children: [
        {
          key: `min${level.dataIndex}}`,
          title: i18n().qcvnMin,
          align: 'left',
          dataIndex: 'key',
          render: measureKey => {
            const measureValue = get(measuringStationObj, [
              measureKey,
              `min${level.dataIndex}`,
            ])
            return <div>{measureValue}</div>
          },
        },
        {
          key: `max${level.dataIndex}}`,
          title: i18n().qcvnMax,
          dataIndex: 'key',
          render: measureKey => {
            const measureValue = get(measuringStationObj, [
              measureKey,
              `max${level.dataIndex}`,
            ])
            return <div>{measureValue}</div>
          },
          align: 'left',
        },
      ],
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
              {form.getFieldDecorator(`${measureKey}`, {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox />)}
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
