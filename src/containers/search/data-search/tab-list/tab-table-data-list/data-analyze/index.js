import { Table } from 'antd'
import BoxShadow from 'components/elements/box-shadow/index'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import moment from 'moment/moment'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const TabeListWrapper = styled(BoxShadow)`
  padding: 16px;
  position: relative;
`

@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
export default class TableDataList extends React.PureComponent {
  columns = [
    {
      title: translate('dataSearchFrom.analyze.parameters'),
      dataIndex: 'key',
      key: 'key',
      render: (value, record, index) => {
        const { measuresObj } = this.props
        return <div>{measuresObj[value].name}</div>
      },
    },
    {
      title: translate('dataSearchFrom.analyze.maxTime'),
      dataIndex: 'maxTime',
      key: 'maxTime',
      render: (value, record, index) => {
        return <div>{value ? moment(value).format(DD_MM_YYYY_HH_MM) : '-'}</div>
      },
    },
    {
      title: translate('dataSearchFrom.analyze.max'),
      dataIndex: 'max',
      key: 'max',
      render: (value, record, index) => {
        return <div>{getFormatNumber(value, FORMAT_VALUE_MEASURING)}</div>
      },
    },
    {
      title: translate('dataSearchFrom.analyze.minTime'),
      dataIndex: 'minTime',
      key: 'minTime',
      render: (value, record, index) => {
        return <div>{value ? moment(value).format(DD_MM_YYYY_HH_MM) : '-'}</div>
      },
    },
    {
      title: translate('dataSearchFrom.analyze.min'),
      dataIndex: 'min',
      key: 'min',
      render(value, record, index) {
        return <div>{getFormatNumber(value, FORMAT_VALUE_MEASURING)}</div>
      },
    },
    {
      title: translate('dataSearchFrom.analyze.avg'),
      dataIndex: 'avg',
      key: 'avg',
      render: (value, record, index) => {
        return <div>{getFormatNumber(value, FORMAT_VALUE_MEASURING)}</div>
      },
    },
  ]

  render() {
    const { dataAnalyzeStationAuto, loading } = this.props

    return (
      <TabeListWrapper>
        <Table
          loading={loading}
          size="small"
          rowKey={(_, index) => index}
          columns={this.columns}
          dataSource={dataAnalyzeStationAuto}
          pagination={false}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </TabeListWrapper>
    )
  }
}
