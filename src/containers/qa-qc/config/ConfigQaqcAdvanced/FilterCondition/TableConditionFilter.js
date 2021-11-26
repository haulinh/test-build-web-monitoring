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
        dataIndex: 'key',
        render: value => {
          return value
        },
      },
      {
        title: 'Tên điều kiện',
        dataIndex: 'conditionName',
        render: value => {
          return value
        },
      },
      {
        title: 'Trạm áp dụng',
        dataIndex: 'stationName',
        render: value => {
          return value
        },
      },
      {
        title: 'Thông số điều kiện',
        dataIndex: 'conditionMeasure[0].conditionMeasureItem',
        render: value => {
          return value
        },
      },
      {
        title: 'Thông số loại bỏ',
        dataIndex: 'conditionMeasure[0].excludeMeasure',
        render: value => {
          return value
        },
      },
      {
        title: '',
        align: 'center',
        render: (value, record) => {
          return (
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
          )
        },
      },
    ]
  }

  render() {
    const { dataSource, ...otherProps } = this.props

    return (
      <Table
        columns={this.columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        {...otherProps}
      />
    )
  }
}

export default TableConditionFilter
