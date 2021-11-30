import { Icon, Row, Table, Button } from 'antd'
import React from 'react'
import moment from 'moment'
const TableConditionFilter = ({
  onEditRecord,
  setConditionFilterItemKey,
  dataSource,
  isDisabled,
  ...otherProps
}) => {
  const operators = {
    eq: '=',
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<=',
  }

  const data = dataSource.reduce((base, current) => {
    const dataFormat = current.conditions.map((dataItem, index) => {
      return {
        ...dataItem,
        createdAt: current.createdAt,
        _id: current._id,
        name: current.name,
        station: current.station,
        conditionMeasureItem: `${dataItem.measure} ${
          operators[dataItem.operator]
        } ${dataItem.value}`,
        ...(index === 0 && {
          spanMerge: current.conditions.length,
          indexMerge: true,
        }),
      }
    })
    return [...base, ...dataFormat]
  }, [])

  let count = 0
  const columns = [
    {
      title: '#',
      align: 'center',
      render: (value, record, index) => {
        const obj = {
          children: (
            <div
              style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}
            >
              {record.indexMerge ? (count += 1) : (count += 0)}
            </div>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }

        return obj
      },
    },
    {
      title: 'Tên điều kiện',
      dataIndex: 'name',
      render: (value, record, index) => {
        const obj = {
          children: (
            <div
              style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}
            >
              {value}
            </div>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }

        return obj
      },
    },
    {
      title: 'Trạm áp dụng',
      dataIndex: 'station.name',
      render: (value, record, index) => {
        const obj = {
          children: (
            <div
              style={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}
            >
              {value}
            </div>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }

        return obj
      },
    },
    {
      title: 'Thông số điều kiện',
      dataIndex: 'conditionMeasureItem',
      render: value => {
        return <div style={{ color: '#1890ff', fontWeight: 500 }}>{value}</div>
      },
    },
    {
      title: 'Thông số loại bỏ',
      dataIndex: 'excludeMeasures',
      render: value => {
        return (
          <div style={{ color: '#1890ff', fontWeight: 500 }}>
            {value.join(', ')}
          </div>
        )
      },
    },
    {
      title: '',
      align: 'center',
      render: (value, record, index) => {
        const obj = {
          children: (
            <Row>
              <Button type="link" disabled={!isDisabled} onClick={onEditRecord}>
                <Icon type="edit" style={{ color: '#1890FF' }} />
              </Button>
              <Button
                type="link"
                disabled={!isDisabled}
                onClick={() => {
                  setConditionFilterItemKey(value._id)
                }}
              >
                <Icon type="delete" style={{ color: '#E64D3D' }} />
              </Button>
            </Row>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }

        return obj
      },
    },
  ]

  const dataSort = data.sort(function(a, b) {
    return moment(a.createdAt).format('X') - moment(b.createdAt).format('X')
  })

  return (
    <div style={{ opacity: !isDisabled && '0.5' }}>
      <Table
        columns={columns}
        dataSource={dataSort}
        pagination={false}
        bordered
        {...otherProps}
      />
    </div>
  )
}

export default TableConditionFilter
