import { Col, Popconfirm, Row, Table } from 'antd'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { i18n } from './form/AlarmForm'
import { alarmType } from './index'
import { translate } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'

const TableStyled = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`

const AlarmList = ({ data, loading, getData, ...props }) => {
  const updateStatus = async (id, status) => {
    await CalculateApi.updateStatusAlarm(id, status)
    getData()
  }
  const columns = [
    {
      dataIndex: 'stationId',
      title: i18n().form.label.station,
      render: value => (
        <div>{_.get(props.stationAutoById, `${value}.name`)}</div>
      ),
    },
    {
      dataIndex: 'name',
      title: i18n().form.label.name,
      render: value => <div>{value}</div>,
    },
    {
      dataIndex: 'type',
      title: i18n().form.label.type,
      render: value => <div>{alarmType[value].label()}</div>,
    },
    {
      dataIndex: 'status',
      title: translate('dataLogger.list.colAction'),
      render: (value, record) => {
        return (
          <Row type="flex" gutter={12}>
            <Col>
              <Popconfirm
                title={translate('alarm.popconfirm.title')}
                okText={translate('global.submit')}
                cancelText={translate('global.cancel')}
                onConfirm={() => updateStatus(record._id, 'delete')}
              >
                <div style={{ color: '#E64D3D' }}>
                  {translate('global.delete')}
                </div>
              </Popconfirm>
            </Col>
            <Col>
              {value === 'disable' ? (
                <div
                  onClick={() => updateStatus(record._id, 'enable')}
                  style={{ color: '#1890FF' }}
                >
                  {translate('global.enable')}
                </div>
              ) : (
                <div
                  onClick={() => updateStatus(record._id, 'disable')}
                  style={{ color: '#E64D3D' }}
                >
                  {translate('global.disable')}
                </div>
              )}
            </Col>
          </Row>
        )
      },
    },
  ]

  return (
    <React.Fragment>
      <TableStyled
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </React.Fragment>
  )
}

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return { stationAutoById }
}

export default connect(mapStateToProp)(AlarmList)
