import { Checkbox, Form, Table } from 'antd'
import { get, isEqual, keyBy } from 'lodash'
import React, { Component } from 'react'
import { i18n } from '../constants'

@Form.create()
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

  getColumns = () => {
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
    return [
      {
        title: i18n().measure,
        key: 'measure',
        dataIndex: 'key',
        align: 'left',
        width: '10%',
      },
      ...columns,
      {
        title: '',
        key: 'enable',
        dataIndex: 'key',
        render: measureKey => {
          const { form } = this.props
          return (
            <React.Fragment>
              {form.getFieldDecorator(`${measureKey}`, {
                valuePropName: 'checked',
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
