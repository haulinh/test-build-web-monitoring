import { Icon, Row, Table, Button } from 'antd'
import React from 'react'

class TableConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    const { onEditRecord, setConditionFilter } = this.props
    this.state = {
      isShowModalEditCondition: false,
    }

    this.columns = [
      {
        title: '#',
        render: (value, record, index) => {
          const obj = {
            children: index + 1,
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
            children: value,
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
            children: value,
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
          return <div style={{ color: '#1890ff' }}>{value}</div>
        },
      },
      {
        title: 'Thông số loại bỏ',
        dataIndex: 'excludeMeasures',
        render: value => {
          return <div style={{ color: '#1890ff' }}>{value.join(', ')}</div>
        },
      },
      {
        title: '',
        align: 'center',
        render: (value, record, index) => {
          const obj = {
            children: (
              <Row>
                <Button type="link" onClick={onEditRecord}>
                  <Icon type="edit" style={{ color: '#1890FF' }} />
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setConditionFilter(record.key)
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
  }

  render() {
    const { dataSource, isDisabled, ...otherProps } = this.props
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

    return (
      <div style={{ opacity: !isDisabled && '0.5' }}>
        <Table
          columns={this.columns}
          dataSource={data}
          pagination={false}
          bordered
          {...otherProps}
        />
      </div>
    )
  }
}

export default TableConditionFilter
