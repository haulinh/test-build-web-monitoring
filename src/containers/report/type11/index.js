import { Button, Form, Spin, Table, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
import { DD_MM_YYYY, DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import ROLE from 'constants/role'
import createLanguage, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get as _get, map as _map } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { getTimeUTC } from 'utils/datetime'
import { downFileExcel } from 'utils/downFile'
// import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form/search-form-3'

// import axios from 'axios'

const { Title, Text } = Typography

function i18n() {
  return {
    header8: translate('avgSearchFrom.table.header8'),
    title: translate('avgSearchFrom.table.title6'),
  }
}

@Form.create()
@protectRole(ROLE.TB1H.VIEW)
@createLanguage
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
      visibleModal: false,
      langExport: 'vi',
    }
  }

  getParams = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const time = {
      from: getTimeUTC(moment(values.time).startOf('day')),
      to: getTimeUTC(moment(values.time).endOf('day')),
    }
    const params = {
      stationKey: values.stationAuto,
      from: time.from,
      to: time.to,
      isFilter: values.isFilter,
      groupType: 'custom',
      timeInterval: 60,
    }
    return params
  }

  getColumns = () => {
    const columns = _map(this.state.measuringList, item => {
      return {
        key: item.key,
        title: `${item.name} (${_get(item, 'unit', '')})`,
        dataIndex: `measuringLogs.${item.key}`,
        align: 'right',
        width: 120,
        render: value => {
          if (!value) {
            return '-'
          } else {
            return <div>{getFormatNumber(value.value, ROUND_DIGIT)}</div>
          }
        },
      }
    })

    return [
      {
        title: i18n().header8,
        dataIndex: 'receivedAt',
        align: 'left',
        width: 120,
        render: value => {
          return (
            <div style={{ textAlign: 'left' }}>
              {moment(value)
                .tz(_get(this.props, 'timeZone.value', ''))
                .format(DD_MM_YYYY_HH_MM)}
            </div>
          )
        },
      },
      ...columns,
    ]
  }

  handleSubmit = async values => {
    const measuringListStr = values.measuringList
      .map(item => encodeURIComponent(item.key))
      .join(',')

    let params = this.getParams()
    params = {
      ...params,
      measuringList: measuringListStr,
    }

    try {
      const res = await DataInsight.getDataAverage(params.stationKey, params)

      this.setState({
        dataSource: res.data,
        isHaveData: true,
        isLoading: false,
        measuringList: values.measuringList,
        stationName: values.stationName,
        dataSearch: params,
        dayFormat: moment(values.time).format(DD_MM_YYYY),
      })
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  handleExcel = async () => {
    const {
      form,
      lang: { translateManual },
    } = this.props

    const time = form.getFieldValue('time')

    let params = this.getParams()
    const { groupType, ...newParams } = params

    params = {
      ...newParams,
      lang: this.state.langExport,
    }

    const titleName = translateManual(
      'report.type11.fileNameExcel',
      null,
      null,
      this.state.langExport
    )
    const fileNameExcel = `${titleName}${time.format('DDMMYYYY')}`

    try {
      const res = await DataInsight.exportDataAverageDetail(
        params.stationKey,
        params
      )

      downFileExcel(res.data, fileNameExcel)
      this.setState({
        visibleModal: false,
      })
    } catch (error) {
      this.setState({
        visibleModal: false,
      })
    }
  }

  handleOkModal = e => {
    this.setState({
      visibleModal: true,
    })
  }

  handleCancelModal = e => {
    this.setState({
      visibleModal: false,
    })
  }

  onChangeModal = e => {
    this.setState({
      langExport: e.target.value,
    })
  }

  render() {
    const { form } = this.props
    return (
      <PageContainer>
        <Breadcrumb items={['type11']} />
        <Clearfix height={16} />
        <SearchForm
          form={form}
          cbSubmit={this.handleSubmit}
          isDatePicker={true}
        />
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
        <ModalLangExport
          showModal={this.state.visibleModal}
          handleOkModal={this.handleExcel}
          handleCancelModal={this.handleCancelModal}
          onChangeModal={this.onChangeModal}
          langExport={this.state.langExport}
        />
      </PageContainer>
    )
  }
}
