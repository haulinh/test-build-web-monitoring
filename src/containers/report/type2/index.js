import { Button, Form, Spin, Table, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date'
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
import Breadcrumb from '../breadcrumb'
import SearchForm from '../search-form/search-form-3'

// import axios from 'axios'

const { Title, Text } = Typography

function i18n() {
  return {
    header7: translate('avgSearchFrom.table.header7'),
    title: translate('avgSearchFrom.table.title2'),
  }
}

@Form.create()
@protectRole(ROLE.TB24H.VIEW)
@createLanguage
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
      visibleModal: false,
      langExport: 'vi',
    }
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
        title: i18n().header7,
        dataIndex: 'receivedAt',
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

  getParams = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const time = {
      from: getTimeUTC(moment(values.time).startOf('month')),
      to: getTimeUTC(moment(values.time).endOf('month')),
    }
    const params = {
      stationKey: values.stationAuto,
      from: time.from,
      to: time.to,
      isFilter: values.isFilter,
      groupType: 'custom',
      timeInterval: 24 * 60,
    }
    return params
  }

  handleSubmit = async values => {
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
      } catch (error) {
        this.setState({
          isLoading: false,
        })
      }
    }
  }

  handleExcel = async () => {
    const { form } = this.props
    const time = form.getFieldValue('time')

    const {
      lang: { translateManual },
    } = this.props
    let params = this.getParams()

    const { groupType, ...newParams } = params

    params = {
      ...newParams,
      lang: this.state.langExport,
    }

    const titleName = translateManual(
      'report.type2.fileNameExcel',
      null,
      null,
      this.state.langExport
    )
    const fileNameExcel = `${titleName}${time.format('MMYYYY')}`

    try {
      const res = await DataInsight.exportDataAverageDetail(
        params.stationKey,
        params
      )

      downFileExcel(res.data, fileNameExcel)
      this.setState({
        visibleModal: false,
      })
    } catch (error) {}

    this.setState({
      visibleModal: false,
    })
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
        <Breadcrumb items={['type2']} />
        <Clearfix height={16} />
        <SearchForm form={form} cbSubmit={this.handleSubmit} />
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
