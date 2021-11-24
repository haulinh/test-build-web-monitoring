import React, { Component } from 'react'
import { Table, Row, Icon, Button } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import styled from 'styled-components'
import { getTimeUTC } from 'utils/datetime/index'

const BoxStatus = styled.div`
  text-align: center;
  border-radius: 4px;
  padding: 5px 12px;
`
export default class TableFilterTime extends Component {
  constructor(props) {
    super(props)
    const { onEditFilterTime, setTimeFilterItemKey } = this.props

    this.columns = [
      {
        title: '#',
        width: 50,
        align: 'center',
        render: (value, record, index) => <div>{index + 1}</div>,
      },
      {
        title: 'Trạm quan trắc',
        dataIndex: 'name',
        render: (value, record) => (
          <div style={{ fontWeight: 500 }}>{value}</div>
        ),
      },

      {
        title: 'Thông số',
        dataIndex: 'conditions',
        align: 'left',
        width: 332,
        render: value => {
          const measureList = _.map(value, 'measure')
          return (
            <div style={{ color: '#1890ff' }}>{measureList.join(', ')}</div>
          )
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'conditions',
        align: 'center',
        render: value => {
          const endTimes = _.map(value, 'endAt')
          const currentTime = getTimeUTC(moment())
          const checkTime = endTimes.filter(time =>
            moment(time).isSameOrAfter(moment(currentTime))
          )
          if (_.isEmpty(checkTime)) {
            return (
              <BoxStatus
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280',
                }}
              >
                Quá hạn
              </BoxStatus>
            )
          }
          return (
            <BoxStatus
              style={{
                backgroundColor: '#E1EDFB',
                color: '#1890FF',
              }}
            >
              Áp dụng
            </BoxStatus>
          )
        },
      },
      {
        title: '',
        align: 'center',
        render: record => {
          return (
            <Row>
              <Button type="link" onClick={onEditFilterTime}>
                <Icon type="edit" style={{ color: '#1890FF' }} />
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setTimeFilterItemKey(record.key)
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
    const { dataSource, onCreateFilterTime, ...otherProps } = this.props
    return (
      <Table
        columns={this.columns}
        bordered
        dataSource={dataSource}
        {...otherProps}
        pagination={false}
        footer={() => (
          <Row style={{ color: '#1890FF' }} align="middle">
            <Button type="link" onClick={onCreateFilterTime}>
              <Icon type="plus" style={{ marginRight: 5 }} />
              Thêm điều kiện lọc
            </Button>
          </Row>
        )}
      />
    )
  }
}
