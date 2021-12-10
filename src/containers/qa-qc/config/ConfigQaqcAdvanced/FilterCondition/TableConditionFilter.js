import { Icon, Row, Table, Button } from 'antd'
import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { i18n } from './index'

const TableConditionFilter = ({
  setEditItemKey,
  setDeleteItemKey,
  dataSource,
  isDisabled,
  measuresObj,
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
        key: `${current._id}_${dataItem.measure}_${uuidv4()}`,
        conditionMeasureItem: `${get(measuresObj[dataItem.measure], 'name')} ${
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
      width: 50,
      align: 'center',
      render: (value, record, index) => {
        const obj = {
          children: (
            <div style={{ fontWeight: 500, fontSize: '14px' }}>
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
      title: i18n().list.table.conditionName,
      dataIndex: 'name',
      width: 200,
      render: (value, record, index) => {
        const obj = {
          children: (
            <div
              style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'pre' }}
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
      title: i18n().list.table.applicableStation,
      width: 300,
      dataIndex: 'station.name',
      render: (value, record, index) => {
        const obj = {
          children: (
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{value}</div>
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
      title: i18n().list.table.conditionParameter,
      width: 171,
      dataIndex: 'conditionMeasureItem',
      render: value => {
        return <div style={{ color: '#1890ff' }}>{value}</div>
      },
    },
    {
      title: i18n().list.table.excludeParameter,
      width: 245,
      dataIndex: 'excludeMeasures',
      render: value => {
        const measureExcludeListName = value.map(
          excludeMeasure => measuresObj[excludeMeasure].name
        )
        return (
          <div style={{ color: '#1890ff' }}>
            {measureExcludeListName.join(', ')}
          </div>
        )
      },
    },
    {
      title: '',
      align: 'center',
      width: 150,
      render: (value, record, index) => {
        const obj = {
          children: (
            <Row>
              <Button type="link" onClick={() => setEditItemKey(value)}>
                <Icon type="edit" style={{ color: '#1890FF' }} />
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setDeleteItemKey(value)
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
    return moment(a.createdAt) - moment(b.createdAt)
  })

  return (
    <div
      style={{
        ...(isDisabled && {
          pointerEvents: 'none',
          opacity: 0.5,
        }),
      }}
    >
      <Table
        rowKey={record => record.key}
        columns={columns}
        dataSource={dataSort}
        pagination={false}
        bordered
        {...otherProps}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  measuresObj: state.global.measuresObj,
})

export default connect(mapStateToProps)(TableConditionFilter)
