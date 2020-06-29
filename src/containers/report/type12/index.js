import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form/search-form-4'
// import {
//   getUrlReportType2,
//   getUrlReportType2Excel
// } from "api/DataStationAutoApi";
import {
  getUrlReportType11,
  downloadExcel_reportType11,
} from 'api/DataStationAutoApi'
import { Table, Typography, Button, Spin, message } from 'antd'
import { map as _map, get as _get } from 'lodash'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { MM_YYYY, DD_MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import { connect } from 'react-redux'

// import axios from 'axios'

const { Title, Text } = Typography
const i18n = {
  header1: translate('avgSearchFrom.table.header9'),
  title: translate('avgSearchFrom.table.title4'),
}

@protectRole(ROLE.TILE_DULIE_VUOTNGUONG.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
export default class ReportType12 extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      isHaveData: false,
      isLoading: false,
      isLoadingExcel: false,
      dataSource: [],
      dataSearch: null,
      fromMonth: '',
      toMonth: '',
      measuringList: [],
    }
  }

  getColumns = () => {
    const columns = _map(this.state.measuringList, item => {
      return {
        key: item.key,
        title: `${item.name} (%)`,
        // dataIndex: item.key,
        align: 'center',
        render: (value, record) => {
          // console.log(record,"record")
          value = _get(record, `resultChiTieu.${item.key}.persenVuotNguong`)
          return <div>{getFormatNumber(value, ROUND_DIGIT)}</div>
        },
      }
    })

    return [
      {
        title: i18n.header1,
        dataIndex: 'day',
        align: 'center',
        render: value => {
          return (
            <div style={{ textAlign: 'left' }}>
              {moment(value)
                .tz(_get(this.props, 'timeZone.value', ''))
                .format(DD_MM_YYYY)}
            </div>
          )
        },
      },
      ...columns,
    ]
  }

  handleSubmit = async values => {
    this.setState({
      isHaveData: false,
      isLoading: true,
    })
    // console.log(values, "handleSubmit");
    const params = {
      fromDate: moment(values.fromMonth)
        .utcOffset(this.props.timeZone.time)
        .startOf('day')
        .utc()
        .format(),
      toDate: moment(values.toMonth)
        .utcOffset(this.props.timeZone.time)
        .endOf('day')
        .utc()
        .format(),
      measuringList: values.measuringListStr,
      measuringListUnitStr: values.measuringListUnitStr,
      key: values.stationAuto,
    }
    // console.log(params,"params")

    const res = await getUrlReportType11(params)
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
    }
  }

  handleExcel = () => {
    let url = downloadExcel_reportType11(
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
        <Breadcrumb items={['type12']} />
        <SearchForm cbSubmit={this.handleSubmit} isDatePicker={true} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n.title}</Title>
          <Text>
            {' '}
            {translate('avgSearchFrom.table.description4', {
              fromMonth: this.state.fromMonth,
              toMonth: this.state.toMonth,
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
