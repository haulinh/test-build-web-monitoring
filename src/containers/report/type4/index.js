import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
// import SearchForm from "../search-form";
import SearchForm from '../search-form/search-form-3'
import { Table, Typography, Button, Spin } from 'antd'
import {
  getUrlReportType4,
  getUrlReportType4Excel,
} from 'api/DataStationAutoApi'
import { map as _map, get as _get } from 'lodash'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import Clearfix from 'components/elements/clearfix'
import { connect } from 'react-redux'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const { Title, Text } = Typography
const i18n = {
  header: translate('avgSearchFrom.table.header7'),
  title: translate('avgSearchFrom.table.title5'),
}

@protectRole(ROLE.TB8MAX.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
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
      isFilter: false
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
          return <span>{moment(value, 'YYYY-MM-DD').format(DD_MM_YYYY)}</span>
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

      let measuringListStr = ''
      measuringListStr = values.measuringList
        .map(item => encodeURIComponent(item.key))
        .join(',')
      this.setState({
        isFilter: values.isFilter || false
      })
      let res = await getUrlReportType4(
        values.stationAuto,
        values.time.format('MM-YYYY'),
        measuringListStr,
        measuringListUnitStr,
        values.isFilter || false
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

  getLanguage = lang => {
    switch (lang) {
      case 'en':
        return 'EN'
      case 'vi':
        return 'VI'
      default:
        return 'EN'
    }
  }

  handleExcel = async () => {
    const language = this.getLanguage(this.props.locale)

    let url = await getUrlReportType4Excel(
      this.props.token,
      this.state.dataSearch.stationAuto,
      this.state.dataSearch.time,
      this.state.dataSearch.measuringListStr,
      this.state.dataSearch.measuringListUnitStr,
      language,
      this.state.isFilter || false
    )
    window.open(url, '_blank')
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type4']} />
        <Clearfix height={16} />
        <SearchForm cbSubmit={this.handleSubmit} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n.title}</Title>
          <Text>
            {' '}
            {translate('avgSearchFrom.table.description5', {
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
              {protectRole(ROLE.TB8MAX.EXPORT)(
                <Button
                  type="primary"
                  icon="file-excel"
                  loading={this.state.isLoadingExcel}
                  onClick={this.handleExcel}
                >
                  {translate('avgSearchFrom.tab.exportExcel')}
                </Button>
              )}
            </div>
          )}
        </div>
        <Clearfix height={40} />
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
