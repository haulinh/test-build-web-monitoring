import { Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { getDataPoint } from '../../../api/station-fixed/DataPointApi'
import Breadcrumb from './breadcrumb'
import { SearchForm } from './search-form'

export class StationFixedReport extends React.Component {
  state = {
    dataPoints: [],
  }

  async componentDidMount() {}

  onSearch = async queryParam => {
    const {
      phaseIds,
      pointKeys,
      startDate,
      endDate,
      stationTypeId,
    } = queryParam

    const dataPoints = await getDataPoint({
      point: {
        pointKeys,
      },
      filter: {
        where: {
          stationTypeId,
          'phase._id': {
            inq: phaseIds,
          },
          createdAt: {
            between: [startDate, endDate],
          },
        },
      },
    })
    this.setState({ dataPoints: dataPoints })
  }

  getColumns = () => {
    const { dataPoints } = this.state
    const columnIndex = {
      title: 'STT',
      dataIndex: 'Index',
      key: 'Index',
      render(value, record, index) {
        return <div>{index + 1}</div>
      },
    }

    const columnReceivedAt = {
      title: translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>
      },
    }

    const columnPhase = {
      title: 'Phase Name',
      dataIndex: 'phase',
      key: 'phase',
      render(value) {
        return <div>{value.name}</div>
      },
    }

    const columnPoint = {
      title: 'Point Name',
      dataIndex: 'point',
      key: 'point',
      render(value) {
        return <div>{value.key}</div>
      },
    }

    const measureList = _.get(dataPoints, 'measureList', [])

    const columnsMeasuring = measureList.map(measuring => ({
      title: `${measuring}`,
      dataIndex: `measuringLogs.${measuring}`,
      key: measuring,
      align: 'right',
      render: valueColumn => {
        return <div>{valueColumn && valueColumn.value}</div>
      },
    }))

    return [columnIndex, columnReceivedAt, columnPhase, columnPoint, ...columnsMeasuring]
  }

  render() {
    const { dataPoints } = this.state
    return (
      <PageContainer>
        <Breadcrumb items={['base']} />
        <SearchForm handleOnSearch={this.onSearch} />
        <Table
          size="small"
          rowKey="_id"
          columns={this.getColumns()}
          dataSource={dataPoints.data}
        />
      </PageContainer>
    )
  }
}
