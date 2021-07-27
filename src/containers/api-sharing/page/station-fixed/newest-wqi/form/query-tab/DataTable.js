
import { Table } from 'antd';
import React from 'react';
import { translate as t } from 'hoc/create-lang';
import styled from 'styled-components'
import { get } from 'lodash-es';

const i18n = {
  order: t('wqiStationFix.order'),
  pointName: t('wqiStationFix.pointName'),
  avgTime: t('wqiStationFix.avgTime'),
  wqiValue: t('wqiStationFix.wqiValue'),
  wqiLevel: t('wqiStationFix.wqiLevel'),
  lat: t('wqiStationFix.lat'),
  lng: t('wqiStationFix.lng'),
}

const TableCustom = styled(Table)`
  tr > td{
    background: #ffffff !important;
  }
  padding-bottom: 30px
`

const Value = styled.span`
  color: ${props => props.color}
`

class WQIList extends React.Component {
  columns = [
    {
      title: i18n.order,
      key: 'order',
      render: (_, __, idx) => idx + 1
    },
    {
      title: i18n.pointName,
      width: 200,
      key: 'name',
      render: (_, record) => {
        const obj = {
          children: get(record, 'point.name'),
          props: {
            rowSpan: record.size ? record.size : 1,
            colSpan: record.size ? 1 : 0,
          }
        }
        return obj
      }
    },
    {
      title: i18n.lat,
      width: 90,
      key: 'lat',
      dataIndex: 'point.mapLocation.lat',
    },
    {
      title: i18n.lng,
      width: 90,
      key: 'lng',
      dataIndex: 'point.mapLocation.lng',
    },
    {
      title: i18n.avgTime,
      width: 100,
      key: 'time',
      dataIndex: 'datetime',
    },
    {
      title: i18n.wqiValue,
      width: 80,
      key: 'wqi',
      dataIndex: 'wqiResult.wqi',
      render: (value, record) => value
        ? <Value color={get(record, 'wqiResult.level.backgroundColor')}>{Math.round(value)}</Value>
        : '-'
    },
    {
      title: i18n.wqiLevel,
      width: 100,
      key: 'status',
      dataIndex: 'wqiResult.level.name',
      render: value => value ? value : '-'
    }
  ]

  getMeasureColumns = () => {
    const { dataSource } = this.props

    const measures = new Set();
    dataSource.forEach(item => {
      Object.keys(get(item, 'wqiResult.detail', {}))
        .forEach(measure => measures.add(measure))
    });

    return Array.from(measures).map(measure => ({
      title: `WQI(${measure})`,
      key: measure,
      render: value => get(value, `wqiResult.detail[${measure}]`) ? get(value, `wqiResult.detail[${measure}]`) : '-'
    }))
  }

  render() {
    const { loading, dataSource } = this.props;

    const measureColumns = this.getMeasureColumns()
    const columns = [...this.columns];
    columns.splice(5, 0, ...measureColumns)


    return (
      <TableCustom
        loading={loading}
        bordered
        rowKey={(record) => `${record.point.key}_${record.datetime}`}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    )
  }
}

export default WQIList
