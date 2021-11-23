import React, { Component } from 'react'
import { Table, Row, Icon, Button } from 'antd'

export default class TableFilterTime extends Component {
  constructor(props) {
    super(props)
    const { onEditRecord, setTimeFilterItem } = this.props
    this.state = {
      recordValue: '',
    }

    this.columns = [
      {
        title: '#',
        dataIndex: 'key',
        width: 50,
        align: 'center',
      },
      {
        title: 'Trạm quan trắc',
        dataIndex: 'stationName',
        render: text => <div style={{ fontWeight: 500 }}>{text}</div>,
      },

      {
        title: 'Thông số',
        className: 'column-money',
        dataIndex: 'measure',
        align: 'left',
        render: value => <div style={{ color: '#1890ff' }}>{value}</div>,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        align: 'center',
        render: value => (
          <span>
            {value === 'outdate' && <div>Quá hạn</div>}
            {value === 'apply' && <div>Áp dụng</div>}
          </span>
        ),
      },
      {
        title: '',
        align: 'center',
        render: record => {
          return (
            <Row>
              <Button type="link" onClick={onEditRecord}>
                <Icon type="edit" style={{ color: '#1890FF' }} />
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setTimeFilterItem(record.key)
                }}
              >
                <Icon type="delete" style={{ color: 'red' }} />
              </Button>
            </Row>
          )
        },
      },
    ]
  }

  render() {
    const { dataSource, showModalFilterTime, ...otherProps } = this.props
    return (
      <Table
        columns={this.columns}
        bordered
        dataSource={dataSource}
        {...otherProps}
        pagination={false}
        footer={() => (
          <Row style={{ color: '#1890FF' }} align="middle">
            <Button type="link" onClick={showModalFilterTime}>
              <Icon type="plus" style={{ marginRight: 5 }} />
              Thêm điều kiện lọc
            </Button>
          </Row>
        )}
      />
    )
  }
}
