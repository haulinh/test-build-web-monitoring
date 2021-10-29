import { Col, Popconfirm, Row, Table } from 'antd'
import CalculateApi from 'api/CalculateApi'
import role, { checkRolePriority } from 'constants/role'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { selectAlarm } from 'redux/actions/alarm'
import styled from 'styled-components'
import { i18n } from './form/AlarmForm'
import { alarmType } from './index'
import protectRole from 'hoc/protect-role'

const TableStyled = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`

const AlarmList = ({
  data,
  loading,
  getData,
  getAlarmItem,
  showDrawer,
  ...props
}) => {
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
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  e.stopPropagation()
                  updateStatus(record._id, 'delete')
                }}
              >
                {protectRole(role.ALARM_MANAGEMENT.DELETE)(
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{ color: '#E64D3D' }}
                  >
                    {translate('global.delete')}
                  </div>
                )}
              </Popconfirm>
            </Col>
            {protectRole(role.ALARM_MANAGEMENT)(
              <Col>
                {value === 'disable' ? (
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      updateStatus(record._id, 'enable')
                    }}
                    style={{ color: '#1890FF' }}
                  >
                    {translate('global.enable')}
                  </div>
                ) : (
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      updateStatus(record._id, 'disable')
                    }}
                    style={{ color: '#E64D3D' }}
                  >
                    {translate('global.disable')}
                  </div>
                )}
              </Col>
            )}
          </Row>
        )
      },
    },
  ]

  return (
    <React.Fragment>
      <TableStyled
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              if (
                !checkRolePriority(props.userInfo, role.ALARM_MANAGEMENT.EDIT)
              )
                return
              props.selectAlarm(record, record.type)
              showDrawer()
            }, // click row
          }
        }}
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
  const userInfo = state.auth.userInfo
  return { stationAutoById, userInfo }
}

const mapDispatchToProps = dispatch => {
  return {
    selectAlarm: (alarmId, alarmType) =>
      dispatch(selectAlarm(alarmId, alarmType)),
  }
}

export default connect(mapStateToProp, mapDispatchToProps)(AlarmList)
