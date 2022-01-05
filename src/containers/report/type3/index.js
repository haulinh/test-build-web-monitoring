import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import { translate } from 'hoc/create-lang'
import { Table, Typography, Button, Spin } from 'antd'
import { map as _map, get as _get } from 'lodash'
import SearchForm from '../search-form/search-form-3'
import DataInsight from 'api/DataInsight'
import { connect } from 'react-redux'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date'
import moment from 'moment-timezone'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import { downFileExcel } from 'utils/downFile'

const { Title, Text } = Typography

function i18n() {
  return {
    header: translate('avgSearchFrom.table.header7'),
    title: translate('avgSearchFrom.table.title3'),
  }
}

@protectRole(ROLE.TB1MAX.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
}))
export default class ReportType3 extends React.Component {
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
      isFilter: false,
    }
  }

  getColumns = () => {
    const columns = _map(this.state.measuringList, item => {
      return {
        width: 120,
        key: item.key,
        title: `${item.name} (${_get(item, 'unit', '')})`,
        dataIndex: `measuringLogs.${item.key}`,
        align: 'right',
        render: value => {
          if (!value) {
            return "-"
          } else {
            return <div>{getFormatNumber(value.value, ROUND_DIGIT)}</div>
          }
        },
      }
    })
    return [
      {
        width: 120,
        title: i18n().header,
        dataIndex: 'timeLocal',
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
    this.setState({
      isFilter: values.isFilter,
    })
    const params = {
      from: moment(values.time, 'MM-YYYY').startOf('month').toDate(),
      to: moment(values.time, 'MM-YYYY').endOf('month').toDate(),
      isFilter: values.isFilter || false,
      timeInterval: 60
    }

    let res = await DataInsight.getDataAverageMax(values.stationAuto, params)
    try {
      this.setState({
        dataSource: res.maxData,
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
    } catch (err) {
      console.log(err)
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
    const language = this.getLanguage(this.props.locale).toLowerCase()
    const { dataSearch, isFilter, stationName } = this.state
    const params = {
      from: moment(dataSearch.time, 'MM-YYYY').startOf('month').toDate(),
      to: moment(dataSearch.time, 'MM-YYYY').endOf('month').toDate(),
      isFilter: isFilter || false,
      timeInterval: 60,
      lang: language
    }
    try {
      const res = await DataInsight.exportDataAverageMax(
        dataSearch.stationAuto,
        params
      )
      const dynamicFileName = {
        vi: 'Bao_cao_1hMax',
        en: 'Report_1hMax'
      }
      downFileExcel(res.data, `${dynamicFileName[language]}_${dataSearch.time}_${stationName}`)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['type3']} />
        <Clearfix height={16} />
        <SearchForm cbSubmit={this.handleSubmit} />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n().title}</Title>
          <Text>
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
              {protectRole(ROLE.TB1MAX.EXPORT)(
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
