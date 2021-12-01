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
    const { onEditFilterTime, onDeleteFilterTime } = this.props
    this.columns = [
      {
        title: '#',
        width: 50,
        align: 'center',
        render: (value, record, index) => (
          <div style={{ fontWeight: 500 }}>{index + 1}</div>
        ),
      },
      {
        title: 'Trạm quan trắc',
        dataIndex: 'station.name',
        width: 350,
        render: value => <div style={{ fontWeight: 500 }}>{value}</div>,
      },

      {
        title: 'Thông số',
        dataIndex: 'conditions',
        align: 'left',
        width: 370,
        render: value => {
          const measureList = value.map(measure => measure.measureName)
          return (
            <div style={{ color: '#1890ff' }}>{measureList.join(', ')}</div>
          )
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'conditions',
        align: 'center',
        width: 120,
        render: value => {
          const endTimes = _.map(value, 'endAt')
          const endToday = moment().endOf('day')
          const today = getTimeUTC(endToday)
          const checkTime = endTimes.filter(time =>
            moment(time).isSameOrAfter(moment(today))
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
        width: 150,
        render: value => {
          return (
            <Row>
              <Button
                type="link"
                onClick={onEditFilterTime}
                disabled={!this.props.isDisable}
              >
                <Icon type="edit" style={{ color: '#1890FF' }} />
              </Button>

              <Button
                disabled={!this.props.isDisable}
                type="link"
                onClick={() => {
                  onDeleteFilterTime(value._id)
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
    const {
      onCreateFilterTime,
      isDisable,
      dataSource,
      ...otherProps
    } = this.props
    return (
      <div style={{ opacity: !isDisable && '0.5' }}>
        <Table
          columns={this.columns}
          bordered
          style={{
            maxHeight: '1000px',
            overflow: 'scroll',
          }}
          dataSource={dataSource}
          {...otherProps}
          pagination={false}
          footer={() => (
            <Row style={{ color: '#1890FF' }} align="middle">
              <Button
                type="link"
                onClick={onCreateFilterTime}
                disabled={!isDisable}
              >
                <Icon type="plus" style={{ marginRight: 5 }} />
                Thêm điều kiện lọc
              </Button>
            </Row>
          )}
        />
      </div>
    )
  }
}
