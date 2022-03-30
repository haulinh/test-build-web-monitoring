import { Button, Icon, Row, Table } from 'antd'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import { DD_MM_YYYY } from 'constants/format-date.js'
import { i18n } from './ReportDetail'

const ReportTable = ({ form }) => {
  const dataSource = [
    {
      _id: '6242f60c0fa360687384fb45',
      reportId: '6242f60c0fa360717484fb44',
      symbol: 'fff',
      datetime: '2022-03-29T12:05:02.131Z',
      weather: 'fff',
      sampler: 'â',
      notes: 'hh',
      monitoringPlace: '2333',
      requirements: '@#',
      method: 'ffgfg',
      chemical: 'Qể',
      conditions: 'đf',
      equipmentlist: 'fff',
      analyst: '565',
      placeOfAnalysis: 'vvv',
      measuringLogs: {
        Pb1: {
          key: 'Pb1',
          value: 123,
          textValue: '123',
        },
        Hg1: {
          key: 'Hg1',
          value: null,
          textValue: 'ses',
        },
        N_test: {
          key: 'N_test',
          value: 33,
          textValue: '33',
        },
      },
      uniqueKey: 'minh4|29/03/2022|19h',
    },
    {
      _id: '6242f60c0fa360687384fb45',
      reportId: '6242f60c0fa360717484fb44',
      symbol: 'fff',
      datetime: '2022-03-29T12:05:02.131Z',
      weather: 'fff',
      sampler: 'â',
      notes: 'hh',
      monitoringPlace: '2333',
      requirements: '@#',
      method: 'ffgfg',
      chemical: 'Qể',
      conditions: 'đf',
      equipmentlist: 'fff',
      analyst: '565',
      placeOfAnalysis: 'vvv',
      measuringLogs: {
        Pb1: {
          key: 'Pb1',
          value: 123,
          textValue: '123',
        },
        Hg1: {
          key: 'Hg1',
          value: null,
          textValue: 'ses',
        },
        N_test: {
          key: 'N_test',
          value: 33,
          textValue: '33',
        },
      },
      uniqueKey: 'minh4|29/03/2022|19h',
    },
    {
      _id: '6242f60c0fa360687384fb45',
      reportId: '6242f60c0fa360717484fb44',
      symbol: 'fff',
      datetime: '2022-03-29T12:05:02.131Z',
      weather: 'fff',
      sampler: 'â',
      notes: 'hh',
      monitoringPlace: '2333',
      requirements: '@#',
      method: 'ffgfg',
      chemical: 'Qể',
      conditions: 'đf',
      equipmentlist: 'fff',
      analyst: '565',
      placeOfAnalysis: 'vvv',
      measuringLogs: {
        Pb1: {
          key: 'Pb1',
          value: 123,
          textValue: '123',
        },
        Hg1: {
          key: 'Hg1',
          value: null,
          textValue: 'ses',
        },
        N_test: {
          key: 'N_test',
          value: 33,
          textValue: '33',
        },
      },
      uniqueKey: 'minh4|29/03/2022|19h',
    },
    {
      _id: '6242f60c0fa360687384fb45',
      reportId: '6242f60c0fa360717484fb44',
      symbol: 'fff',
      datetime: '2022-03-29T12:05:02.131Z',
      weather: 'fff',
      sampler: 'â',
      notes: 'hh',
      monitoringPlace: '2333',
      requirements: '@#',
      method: 'ffgfg',
      chemical: 'Qể',
      conditions: 'đf',
      equipmentlist: 'fff',
      analyst: '565',
      placeOfAnalysis: 'vvv',
      measuringLogs: {
        Pb1: {
          key: 'Pb1',
          value: 123,
          textValue: '123',
        },
        Hg1: {
          key: 'Hg1',
          value: null,
          textValue: 'ses',
        },
        N_test: {
          key: 'N_test',
          value: 33,
          textValue: '33',
        },
      },
      uniqueKey: 'minh4|29/03/2022|19h',
    },
  ]
  const columns = [
    {
      title: '#',
      dataIndex: '',
      key: 'order',
      align: 'center',
      render: (value, record, index) => {
        return <p>{index + 1}</p>
      },
    },
    {
      title: 'Thời gian lấy mẫu',
      dataIndex: 'datatime',
      key: 'datetime',
      align: 'left',
      render: (value, record, index) => {
        return <div>{moment(value).format('HH:mm DD/MM/YYYY')}</div>
      },
    },
    {
      title: 'Tên người lấy mẫu',
      dataIndex: 'sampler',
      key: 'person',
      align: 'left',
      render: (value, record, index) => {
        return <div>{value}</div>
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      align: 'left',
      render: (value, record, index) => {
        return <div>{value}</div>
      },
    },
    // {
    //     title: 'Ghi chú',
    //     dataIndex: 'notes',
    //     key: 'notes',
    //     align: 'left',
    //     render: (value, record, index) => {
    //       return <div>{value}</div>
    //     },
    //   },

    // {Object.values(measuringLogs).reduce((base, current) => {
    //     return base
    // }, {})}
  ]

  const measuringData = Object.values(dataSource[0].measuringLogs).map(
    measuring => {
      return {
        title: measuring.key,
        dataIndex: `measuringLogs.${measuring.key}`,
        align: 'left',
        render: (value, record, index) => {
          return <div>{value.value}</div>
        },
      }
    }
  )

  const optionalInfoValue = form.getFieldsValue()
  const optionalInfoColumn = Object.keys(optionalInfoValue)
    .filter(
      option =>
        optionalInfoValue[option] && option !== 'POINTS' && option !== 'REPORT'
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
        align: 'center',
        render: value => {
          let formatValue = value
          if (option === 'month') formatValue = moment(value).format('M')
          if (option === 'year') formatValue = moment(value).format('YYYY')
          if (option === 'createdAt')
            formatValue = moment(value).format(DD_MM_YYYY)
          return <div>{formatValue}</div>
        },
      }
    })

  console.log(Object.keys(optionalInfoValue))

  console.log(optionalInfoColumn)

  const newColumns = [
    ...columns,
    measuringData,
    optionalInfoColumn,
    {
      title: '',
      align: 'center',
      render: (value, record, index) => {
        return (
          <Button type="link" style={{ marginBottom: '10px' }}>
            <Icon
              style={{
                color: '#E64D3D',
              }}
              type="delete"
            />
          </Button>
        )
      },
    },
  ].flat()
  return (
    <Table
      rowKey="_id"
      dataSource={dataSource}
      columns={newColumns}
      pagination={false}
      bordered
      footer={() => (
        <Row type="flex" style={{ color: '#1890FF' }} align="middle">
          <Button type="link" style={{ fontWeight: 500, fontSize: '16px' }}>
            <Icon type="plus" style={{ marginRight: 5 }} />
            Thêm dữ liệu
          </Button>
        </Row>
      )}
    ></Table>
  )
}

export default ReportTable
