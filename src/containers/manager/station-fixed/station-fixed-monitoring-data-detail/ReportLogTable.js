import { Button, Icon, Popconfirm, Row, Table, message } from 'antd'
import StationFixedReportLog from 'api/station-fixed/StationFixedReportLog'
import { DD_MM_YYYY } from 'constants/format-date.js'
import { get, isNil } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { i18n } from './ReportDetail'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'

const TableStyled = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
  .custom-record {
    width: ${props => `${props.unFixedWidth}px`};
  }
`
@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
class ReportLogTable extends React.Component {
  baseColumns = [
    {
      title: '#',
      dataIndex: '',
      key: 'order',
      align: 'center',
      width: 60,
      fixed: 'left',
      render: (value, record, index) => {
        return <p>{index + 1}</p>
      },
    },
    {
      title: i18n().optionalInfo.dateTime,
      dataIndex: 'datetime',
      key: 'datetime',
      align: 'left',
      width: 180,
      fixed: 'left',
      render: (value, record, index) => {
        return <div>{moment(value).format('HH:mm DD/MM/YYYY')}</div>
      },
    },
    {
      title: i18n().optionalInfo.sampler,
      dataIndex: 'sampler',
      key: 'person',
      align: 'left',
      width:
        Object.entries(
          get(this.props.dataSource, '0.measuringLogs', {})
        ).map(([key, measuringObj]) => ({ key, measuringObj })).length > 1
          ? 250
          : 500,
      fixed: 'left',
      render: (value, record, index) => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n().optionalInfo.notes,
      dataIndex: 'notes',
      key: 'notes',
      align: 'left',
      width:
        Object.entries(
          get(this.props.dataSource, '0.measuringLogs', {})
        ).map(([key, measuringObj]) => ({ key, measuringObj })).length > 1
          ? 350
          : 500,
      render: (value, record, index) => {
        return <div>{value}</div>
      },
    },
  ]

  getColumns = () => {
    const { form, measuresObj, dataSource } = this.props
    return [
      ...this.baseColumns,
      Object.keys(form.getFieldsValue())
        .filter(
          option =>
            this.props.form.getFieldsValue()[option] &&
            option !== 'POINTS' &&
            option !== 'REPORT'
        )
        .map(option => {
          let dataIndex = option
          if (option === 'month' || option === 'year') {
            dataIndex = 'datetime'
          }

          return {
            title: i18n().optionalInfo[option],
            dataIndex: `${dataIndex}`,
            key: `${option}`,
            align: 'left',
            className: 'custom-record',
            render: value => {
              let formatValue = value
              if (option === 'month') formatValue = moment(value).format('M')
              if (option === 'year') formatValue = moment(value).format('YYYY')
              if (option === 'createdAt')
                formatValue = moment(value).format(DD_MM_YYYY)
              return <div>{formatValue}</div>
            },
          }
        }),
      Object.entries(get(dataSource, '0.measuringLogs', {}))
        .map(([key, measuringObj]) => ({ key, measuringObj }))
        .map(measuring => {
          return {
            title: `${measuresObj[measuring.key].name} (${
              measuresObj[measuring.key].unit
            })`,
            dataIndex: `measuringLogs.${get(measuring, 'key', '')}`,
            className: 'custom-record',
            align: 'left',
            render: (value, record, index) => {
              return <div>{isNil(value) ? '' : value.textValue}</div>
            },
          }
        }),
      {
        title: '',
        align: 'center',
        width: 62,
        fixed: 'right',
        render: (value, record, index) => {
          return (
            <Popconfirm
              title={t('stationFixedManager.table.popUp.delete')}
              okText={t('global.submit')}
              cancelText={t('global.cancel')}
              onConfirm={e => {
                e.stopPropagation()
                this.onDelete(record.reportId, record._id)
              }}
              onCancel={e => e.stopPropagation()}
            >
              <div
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={e => e.stopPropagation()}
              >
                <Icon
                  type="delete"
                  style={{ fontSize: '16px', color: 'red' }}
                />
              </div>
            </Popconfirm>
          )
        },
      },
    ].flat()
  }

  onDelete = async (reportId, logId) => {
    const { dataSource, handleDeleteLog } = this.props
    try {
      const response = await StationFixedReportLog.deleteStationFixedReportLog({
        reportId,
        logId,
      })
      if (response) {
        const newDataSource = dataSource.filter(log => log._id !== logId)
        handleDeleteLog(newDataSource)
        message.success(t('addon.onDelete.success'))
      } else {
        message.error(t('addon.onDelete.error'))
      }
    } catch (error) {
      console.log(error)
    }
  }
  render() {
    const {
      onClickReportLog,
      onClickAddReportLog,
      dataSource,
      loading,
    } = this.props

    return (
      <TableStyled
        unFixedWidth={window.innerWidth > 1650 ? 250 : 150}
        rowKey={record => record._id}
        dataSource={dataSource}
        loading={loading}
        columns={this.getColumns()}
        pagination={false}
        // size="small"
        bordered
        scroll={
          window.innerWidth > 1650 ? { y: 500, x: 1500 } : { y: 500, x: 1200 }
        }
        footer={() => (
          <Row type="flex" style={{ color: '#1890FF' }} align="middle">
            <Button
              onClick={() => onClickAddReportLog()}
              type="link"
              style={{ fontWeight: 500, fontSize: '16px' }}
            >
              <Icon type="plus" style={{ marginRight: 5 }} />
              {t('stationFixedManager.table.footer')}
            </Button>
          </Row>
        )}
        onRow={record => {
          return {
            onClick: event => {
              onClickReportLog(record)
            },
          }
        }}
      ></TableStyled>
    )
  }
}

export default ReportLogTable
