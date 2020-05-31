import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import { translate } from 'hoc/create-lang'
// import SearchForm from "../search-form";
import { Table, Typography, Button, Spin } from 'antd'
import { map as _map, get as _get } from 'lodash'
import SearchForm from '../search-form/search-form-3'
import {
  getUrlReportType3,
  getUrlReportType3Excel,
} from 'api/DataStationAutoApi'
import { connect } from 'react-redux'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'
// import axios from 'axios'

const { Title, Text } = Typography
const i18n = {
  header: translate('avgSearchFrom.table.header7'),
  title: translate('avgSearchFrom.table.title3'),
}

@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
export default class ReportType1 extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      isHaveData: false,
      isLoading: false,
      isLoadingExcel: false,
      dataSource: [],
      dataSearch: null,
      stationName: '',
      monthYear: '',
      measuringList: [],
    }
  }

  getColumns = () => {
    const columns = _map(this.state.measuringList, item => {
      return {
        key: item.key,
        title: `${item.name} (${_get(item, 'unit', '')})`,
        dataIndex: item.key,
        align: 'right',
        render: value => {
          return <div>{getFormatNumber(value, ROUND_DIGIT)}</div>
        },
      }
    })
    return [
      {
        title: i18n.header,
        dataIndex: '_id',
        render: value => {
          return <span>{value}</span>
        },
      },
      ...columns,
    ]
  }

  handleSubmit = async values => {
    let measuringListUnitStr = ''
    if (values.measuringList) {
      this.setState({
        isHaveData: false,
        isLoading: true,
      })
      measuringListUnitStr = values.measuringList
        .map(item => encodeURIComponent(item.unit))
        .join(',')
    }

    let measuringListStr = ''
    if (values.measuringList) {
      measuringListStr = values.measuringList
        .map(item => encodeURIComponent(item.key))
        .join(',')
    }

    let res = await getUrlReportType3(
      values.stationAuto,
      values.time.format('MM-YYYY'),
      measuringListStr,
      measuringListUnitStr
    )

    if (res.success) {
      this.setState({
        dataSource: res.data,
        isHaveData: true,
        isLoading: false,
        dataSearch: {
          stationAuto: values.stationAuto,
          time: values.time.format('MM-YYYY'),
          measuringListStr,
          measuringListUnitStr,
        },
        measuringList: values.measuringList,
        stationName: values.stationName,
        monthYear: moment(values.time).format(MM_YYYY),
      })
    }
  }

  handleExcel = () => {
    let url = getUrlReportType3Excel(
      this.props.token,
      this.state.dataSearch.stationAuto,
      this.state.dataSearch.time,
      this.state.dataSearch.measuringListStr,
      this.state.dataSearch.measuringListUnitStr
    )
    window.open(url, '_blank')
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type3']} />
        <SearchForm cbSubmit={this.handleSubmit} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n.title}</Title>
          <Text>
            {' '}
            {translate('avgSearchFrom.table.description3', {
              stationName: this.state.stationName,
              monthYear: this.state.monthYear,
            })}
          </Text>
          {this.state.isHaveData && (
            <div
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
              }}
            >
              <Button
                type="primary"
                icon="file-excel"
                loading={this.state.isLoadingExcel}
                onClick={this.handleExcel}
              >
                {translate('avgSearchFrom.tab.exportExcel')}
              </Button>
            </div>
          )}
        </div>
        <Clearfix height={8} />
        <Spin spinning={this.state.isLoading}>
          <Table
            size="small"
            rowKey="_id"
            columns={this.getColumns()}
            bordered={true}
            dataSource={this.state.dataSource}
            locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
            pagination={false}
          />
        </Spin>
        <Clearfix height={40} />
      </PageContainer>
    )
  }
}
