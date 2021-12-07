import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form/search-form-3'
import {
  getUrlReportType2,
  getUrlReportType2Excel,
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
import ModalLangExport from 'components/elements/modal-lang-export'

// import axios from 'axios'

const { Title, Text } = Typography

function i18n() {
  return {
    header7: translate('avgSearchFrom.table.header7'),
    title: translate('avgSearchFrom.table.title2'),
  }
}

@protectRole(ROLE.TB24H.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
}))
export default class ReportType2 extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      isFilter: false,
      isHaveData: false,
      isLoading: false,
      isLoadingExcel: false,
      dataSource: [],
      dataSearch: null,
      stationName: '',
      monthYear: '',
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
        title: i18n().header7,
        dataIndex: 'date_utc',
        render: value => {
          return (
            <div>
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
    console.log(values, 'handleSubmit')
    let measuringListUnitStr = ''
    if (values.measuringList) {
      this.setState({
        isHaveData: false,
        isLoading: true,
        isFilter: values.isFilter,
      })
      measuringListUnitStr = values.measuringList
        .map(item => encodeURIComponent(item.unit))
        .join(',')

      let measuringListStr = ''
      measuringListStr = values.measuringList
        .map(item => encodeURIComponent(item.key))
        .join(',')

      let res = await getUrlReportType2(
        values.stationAuto,
        values.time.format('MM-YYYY'),
        measuringListStr,
        measuringListUnitStr,
        values.isFilter
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
  }

  handleExcel = async () => {
    let res = await getUrlReportType2Excel(
      this.props.token,
      this.state.dataSearch.stationAuto,
      this.state.dataSearch.time,
      this.state.dataSearch.measuringListStr,
      this.state.dataSearch.measuringListUnitStr,
      this.state.isFilter,
      this.state.langExport.toUpperCase()
    )
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)
    this.setState({
      visableModal: false
    });

    // console.log("getUrlReportType1", url);
    // window.location.href = url
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
        <Breadcrumb items={['type2']} />
        <Clearfix height={16} />
        <SearchForm cbSubmit={this.handleSubmit} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n().title}</Title>
          <Text>
            {' '}
            {translate('avgSearchFrom.table.description2', {
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
              {protectRole(ROLE.TB24H.EXPORT)(
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
            rowKey="_id"
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
