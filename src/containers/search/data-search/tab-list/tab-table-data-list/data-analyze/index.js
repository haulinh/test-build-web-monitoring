import { Table } from 'antd'
import { getMeasurings } from 'api/CategoryApi'
import BoxShadow from 'components/elements/box-shadow/index'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import moment from 'moment/moment'
import React from 'react'
import styled from 'styled-components'

const TabeListWrapper = styled(BoxShadow)`
  padding: 16px;
  position: relative;
`

@autobind
export default class TableDataList extends React.PureComponent {
  state = {
    dataMeasures: new Map(),
  }

  async componentDidMount() {
    const dataMeasures = await getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )
    if (dataMeasures.success) {
      this.setState({
        dataMeasures: new Map(
          dataMeasures.data.map(measure => [measure.key, measure])
        ),
      })
    }
  }

  getColumns = () => {
    const columnIndex = {
      title: translate('dataSearchFrom.analyze.parameters'),
      dataIndex: 'key',
      key: 'key',
      render: (value, record, index) => {
        const item = this.state.dataMeasures.get(record.key)
        return <div>{item ? item.name : ''}</div>
      },
    }
    let column = [
      columnIndex,
      {
        title: translate('dataSearchFrom.analyze.maxTime'),
        dataIndex: 'MaxTime',
        key: 'MaxTime',
        render(value, record, index) {
          let val =
            record.max.data.length > 0
              ? record.max.data[0].receivedAt || ''
              : null
          if (val) {
            val = moment(val).format(DD_MM_YYYY_HH_MM)
          }
          // console.log(val,"val")
          return <div>{val}</div>
        },
      },
      {
        title: translate('dataSearchFrom.analyze.max'),
        dataIndex: 'Max',
        key: 'Max',
        render(value, record, index) {
          let val = record.max.data.length > 0 ? record.max.data[0].value : ''
          val = getFormatNumber(val, FORMAT_VALUE_MEASURING)
          return <div>{val}</div>
        },
      },
      {
        title: translate('dataSearchFrom.analyze.minTime'),
        dataIndex: 'MinTime',
        key: 'MinTime',
        render(value, record, index) {
          let val =
            record.min.data.length > 0
              ? record.min.data[0].receivedAt || ''
              : ''
          if (val) val = moment(val).format(DD_MM_YYYY_HH_MM)
          return <div>{val}</div>
        },
      },
      {
        title: translate('dataSearchFrom.analyze.min'),
        dataIndex: 'Min',
        key: 'Min',
        render(value, record, index) {
          let val = record.min.data.length > 0 ? record.min.data[0].value : ''
          val = getFormatNumber(val, FORMAT_VALUE_MEASURING)
          return <div>{val}</div>
        },
      },
      {
        title: translate('dataSearchFrom.analyze.avg'),
        dataIndex: 'Avg',
        key: 'Avg',
        render(value, record, index) {
          let val = record.avg.data.length > 0 ? record.avg.data[0].value : ''
          val = getFormatNumber(val, FORMAT_VALUE_MEASURING)
          return <div>{val}</div>
        },
      },
    ]

    return column
  }

  render() {
    return (
      <TabeListWrapper>
        <Table
          size="small"
          rowKey="key"
          columns={this.getColumns()}
          dataSource={this.props.dataAnalyzeStationAuto}
          pagination={false}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </TabeListWrapper>
    )
  }
}
