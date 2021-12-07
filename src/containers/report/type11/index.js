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
import { DD_MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import { connect } from 'react-redux'
import ModalLangExport from 'components/elements/modal-lang-export'

// import axios from 'axios'

const { Title, Text } = Typography

function i18n() {
  return {
    header8: translate('avgSearchFrom.table.header8'),
    title: translate('avgSearchFrom.table.title6'),
  }
}

@protectRole(ROLE.TB1H.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
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
      dayFormat: '',
      measuringList: [],
      visableModal: false,
      langExport: 'VI'
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
        title: i18n().header8,
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
      isFilter: values.isFilter || false,
    }

    const res = await getDataStationAutoAvg(
      {
        page: 1,
        itemPerPage: 50,
      },
      params
    )
    if (res.data) {
      const convertedData = res.data.map(d => {
        // console.log(d, '===d===d')
        const result = {
          date_utc: d.date_utc,
        }
        Object.keys(d.measuringLogs).forEach(meaKey => {
          result[meaKey] = d.measuringLogs[meaKey].value
        })
        return result
      })
      // console.log(convertedData, '==convertedData==')
      this.setState({
        dataSource: convertedData,
        isHaveData: true,
        isLoading: false,
        measuringList: values.measuringList,
        stationName: values.stationName,
        dataSearch: params,
        dayFormat: moment(values.time).format(DD_MM_YYYY),
      })
    } else if (res.error) {
      // console.log('ERRROR', dataStationAuto)
      message.error('ERRROR')
      return
    }
  }

  handleExcel = async () => {
    let res = await downloadExcel_DataStationAutov1({
      ...this.state.dataSearch,
      language: this.state.langExport.toUpperCase() || 'EN',
      name: this.state.stationName,
    })
    this.setState({
      visableModal: false
    });
    // console.log(url, '==url==')
    // console.log('this.state.dataSearch', res.data)
    window.location.href = res.data
    // window.open(url, '_blank')
  }

  handleOkModal = e => {
    this.setState({
      visableModal: true
    });
  };

  handleCancelModal = e => {
    this.setState({
      visableModal: false
    });
  };

  onChangeModal = e => {
    this.setState({
      langExport: e.target.value,
    });
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type11']} />
        <Clearfix height={16} />
        <SearchForm cbSubmit={this.handleSubmit} isDatePicker={true} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n().title}</Title>
          <Text>
            {' '}
            {translate('avgSearchFrom.table.description6', {
              stationName: this.state.stationName,
              dayFormat: this.state.dayFormat,
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
              {protectRole(ROLE.TB1H.EXPORT)(
                <Button
                  type="primary"
                  icon="file-excel"
                  loading={this.state.isLoadingExcel}
                  onClick={this.handleOkModal}
                >
                  {translate('avgSearchFrom.tab.exportExcel')}
                </Button>
              )}
            </div>
          )}
        </div>
        <Clearfix height={8} />
        <Spin spinning={this.state.isLoading}>
          <Table
            size="small"
            rowKey="date_utc"
            columns={this.getColumns()}
            bordered={true}
            dataSource={this.state.dataSource}
            locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
            pagination={false}
          />
        </Spin>
        <ModalLangExport showModal={this.state.visableModal} handleOkModal={this.handleExcel} handleCancelModal={this.handleCancelModal} onChangeModal={this.onChangeModal} langExport={this.state.langExport} />
      </PageContainer>
    )
  }
}
