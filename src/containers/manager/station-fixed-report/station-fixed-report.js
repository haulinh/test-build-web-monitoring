import { Button, Checkbox, Form, Popover, Table, Tabs } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { translate as t } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { getDataPoint } from '../../../api/station-fixed/DataPointApi'
import Breadcrumb from './breadcrumb'
import { SearchForm } from './search-form'

const i18n = {
  receivedAt: t('dataPointReport.title.receivedAt'),
  phaseName: t('dataPointReport.title.phaseName'),
  pointName: t('dataPointReport.title.pointName'),
  optionalInfo: {
    symbol: t('dataPointReport.optionalInfo.symbol'),
    weather: t('dataPointReport.optionalInfo.weather'),
    sampler: t('dataPointReport.optionalInfo.sampler'),
    notes: t('dataPointReport.optionalInfo.notes'),
    monitoringPlace: t('dataPointReport.optionalInfo.monitoringPlace'),
    requirements: t('dataPointReport.optionalInfo.requirements'),
    method: t('dataPointReport.optionalInfo.method'),
    chemical: t('dataPointReport.optionalInfo.chemical'),
    conditions: t('dataPointReport.optionalInfo.conditions'),
    equipmentlist: t('dataPointReport.optionalInfo.equipmentlist'),
    analyst: t('dataPointReport.optionalInfo.analyst'),
    placeOfAnalysis: t('dataPointReport.optionalInfo.placeOfAnalysis'),
  }
}

const optionalInfo = [
  { field: 'symbol', checked: false },
  { field: 'weather', checked: false },
  { field: 'sampler', checked: false },
  { field: 'notes', checked: false },
  { field: 'monitoringPlace', checked: false },
  { field: 'requirements', checked: false },
  { field: 'method', checked: false },
  { field: 'chemical', checked: false },
  { field: 'conditions', checked: false },
  { field: 'equipmentlist', checked: false },
  { field: 'analyst', checked: false },
  { field: 'placeOfAnalysis', checked: false },
]

const { TabPane } = Tabs

const OptionalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: inherit;
  }
`

const Flex = styled.div`
  display: flex;
`
@Form.create()
export class StationFixedReport extends React.Component {
  state = {
    dataPoints: [],
  }

  async componentDidMount() {}

  operations = () => (
    <Flex>
      <Popover content={this.content()} placement="bottom" trigger="click">
        <Button icon="profile" style={{ marginRight: '8px' }}>
          Thêm
        </Button>
      </Popover>
      <Button onClick={this.handleClick} type="primary">
        Xuất dữ liệu Excel
      </Button>
    </Flex>
  )

  content = () => {
    const { form } = this.props
    return (
      <Form>
        <OptionalInfoContainer
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {optionalInfo.map(item => (
            <div style={{ marginBottom: '8px' }}>
              {form.getFieldDecorator(item.field)(
                <Checkbox>{i18n.optionalInfo[item.field]}</Checkbox>
              )}
            </div>
          ))}
        </OptionalInfoContainer>
      </Form>
    )
  }

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
          datetime: {
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
      title: i18n.receivedAt,
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>
      },
    }

    const columnPhase = {
      title: i18n.phaseName,
      dataIndex: 'phase',
      key: 'phase',
      render(value) {
        return <div>{value.name}</div>
      },
    }

    const columnPoint = {
      title: i18n.pointName,
      dataIndex: 'point',
      key: 'point',
      render(value) {
        return <div>{value.name}</div>
      },
    }

    const measureList = _.get(dataPoints, 'measureList', [])

    const optionalInfoValue = this.props.form.getFieldsValue()

    const optionalInfoColumn = Object.keys(optionalInfoValue)
      .filter(option => optionalInfoValue[option])
      .map(option => ({
        title: i18n.optionalInfo[option],
        dataIndex: `${option}`,
        key: `${option}`,
        align: 'center',
        render: value => {
          return <div>{value}</div>
        },
      }))

    const columnsMeasuring = measureList.map(measuring => ({
      title: `${measuring}`,
      dataIndex: `measuringLogs.${measuring}`,
      key: measuring,
      align: 'center',
      render: valueColumn => {
        return <div>{valueColumn && valueColumn.value}</div>
      },
    }))

    return [
      columnIndex,
      columnReceivedAt,
      columnPhase,
      columnPoint,
      ...optionalInfoColumn,
      ...columnsMeasuring,
    ]
  }

  render() {
    const { dataPoints } = this.state
    console.log(
      '🚀 ~ file: station-fixed-report.js ~ line 180 ~ StationFixedReport ~ render ~ dataPoints',
      dataPoints
    )
    return (
      <PageContainer>
        <Breadcrumb items={['base']} />
        <SearchForm handleOnSearch={this.onSearch} />
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab="Dữ liệu" key="1" />
        </Tabs>
        <Table
          size="small"
          // rowKey="_id"
          columns={this.getColumns()}
          dataSource={dataPoints.data}
        />
      </PageContainer>
    )
  }
}
