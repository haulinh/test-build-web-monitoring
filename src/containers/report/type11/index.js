import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form/search-form-3'
// import {
//   getUrlReportType2,
//   getUrlReportType2Excel
// } from "api/DataStationAutoApi";
import {
  getDataStationAutoAvg,
  downloadExcel_DataStationAutov1,
} from 'api/DataStationAutoApi'
import { Table, Typography, Button, Spin, message } from 'antd'
import { map as _map, get as _get } from 'lodash'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'

import { connect } from 'react-redux'

// import axios from 'axios'

const { Title, Text } = Typography
const i18n = {
  header8: translate('avgSearchFrom.table.header8'),
  title: translate('avgSearchFrom.table.title3'),
}

@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
export default class ReportType11 extends React.Component {
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
        align: 'center',
        render: value => {
          return <div>{getFormatNumber(value, ROUND_DIGIT)}</div>
        },
      }
    })

    return [
      {
        title: i18n.header8,
        dataIndex: 'date_utc',
        align: 'center',
        render: value => {
          return (
            <div style={{ textAlign: 'left' }}>
              {moment(value)
                .tz(_get(this.props, 'timeZone.value', ''))
                .format('H')}
              h
            </div>
          )
        },
      },
      ...columns,
    ]
  }

  handleSubmit = async values => {
    // console.log(values, "handleSubmit");
    const params = {
      fromDate: moment(values.time)
        .utcOffset(this.props.timeZone.time)
        .startOf('day')
        .utc()
        .format(),
      toDate: moment(values.time)
        .utcOffset(this.props.timeZone.time)
        .endOf('day')
        .utc()
        .format(),
      measuringList: values.measuringListStr,
      measuringListUnitStr: values.measuringListUnitStr,
      type: 60,
      key: values.stationAuto,
    }

    const res = await getDataStationAutoAvg(
      {
        page: 1,
        itemPerPage: 50,
      },
      params
    )
    // console.log(params, "params");
    if (res.success) {
      this.setState({
        dataSource: res.data,
        isHaveData: true,
        isLoading: false,
        measuringList: values.measuringList,
        stationName: values.stationName,
        dataSearch: params,
        monthYear: moment(values.time).format(MM_YYYY),
      })
    } else if (res.error) {
      // console.log('ERRROR', dataStationAuto)
      message.error('ERRROR')
      return
    }
  }

  handleExcel = () => {
    let url = downloadExcel_DataStationAutov1(
      this.props.token,
      this.state.dataSearch
    )
    // console.log("this.state.dataSearch", this.state.dataSearch);
    // window.location.href = url
    window.open(url, '_blank')
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type11']} />
        <SearchForm cbSubmit={this.handleSubmit} isDatePicker={true} />
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
      </PageContainer>
    )
  }
}
