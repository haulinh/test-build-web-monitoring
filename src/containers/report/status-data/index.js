import { Button, Spin, Table, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import { getFormatNumber } from 'constants/format-number'
import ROLE from 'constants/role'
import createLanguage, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role/forMenu'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get as _get, isNumber } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { downFileExcel } from 'utils/downFile'
import Breadcrumb from '../breadcrumb'
import SearchForm from './search-form'

const { Title, Text } = Typography

function i18n() {
  return {
    title: translate('menuApp.report.status_data_obj.title'),
    station: translate('menuApp.report.table.header.station'),
    parameter: translate('menuApp.report.table.header.parameter'),
    dischargeThreshold: translate(
      'menuApp.report.table.header.dischargeThreshold'
    ),
    unit: translate('menuApp.report.table.header.unit'),
    minValue: translate('menuApp.report.table.header.minValue'),
    maxValue: translate('menuApp.report.table.header.maxValue'),
    value: translate('menuApp.report.table.header.value'),
    time: translate('menuApp.report.table.header.time'),
    averageValue: translate('menuApp.report.table.header.averageValue'),
    metricReceived: translate('menuApp.report.table.header.metricReceived'),
    totalValue: translate('menuApp.report.table.header.totalValue'),
    percentData: translate('menuApp.report.table.header.percentData'),
    dataExceedsStandard: translate(
      'menuApp.report.table.header.dataExceedsStandard'
    ),
    timeUsuallyExceeds: translate(
      'menuApp.report.table.header.timeUsuallyExceeds'
    ),
    note: translate('menuApp.report.table.header.note'),
  }
}

@protectRole(ROLE.TINH_TRANG_DU_LIEU.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
@createLanguage
export default class StatusDataReport extends React.Component {
  state = {
    isHaveData: false,
    isLoading: false,
    isLoadingExcel: false,
    dataSource: [],
    stationAutos: [],
    from: null,
    to: null,
    visibleModal: false,
    langExport: 'vi',
  }

  formSearchRef = React.createRef()

  async handleSubmit(values) {
    this.setState({
      isHaveData: false,
      isLoading: true,
      stationAutos: values.stationAutos,
    })
    const { stationAutos, time } = values
    const [from, to] = time

    const params = {
      stationKeys: stationAutos.join(','),
      from: moment(from)
        .startOf('day')
        .toDate(),
      to: moment(to)
        .endOf('day')
        .toDate(),
    }

    try {
      const res = await DataInsight.getReportStatusData(params)
      this.setState({
        dataSource: res,
        isHaveData: true,
        isLoading: false,
        from,
        to,
      })
    } catch (error) {
      console.error({ error })
    }
  }

  handleExcel = async () => {
    const { langExport } = this.state
    const {
      lang: { translateManual },
    } = this.props
    const values = this.formSearchRef.current.getFieldsValue()
    const { stationAutos, time } = values
    const [from, to] = time

    const params = {
      stationKeys: stationAutos.join(','),
      from: moment(from)
        .startOf('day')
        .toDate(),
      to: moment(to)
        .endOf('day')
        .toDate(),
      lang: langExport,
    }
    this.setState({
      isLoadingExcel: true,
    })

    const title = {
      name: 'report.statusData.fileNameExcel',
      time: {
        fromFormat: moment(from).format('DDMMYYYY'),
        toFormat: moment(to).format('DDMMYYYY'),
      },
    }

    const nameFileExcel = translateManual(title.name, null, null, langExport)

    try {
      const res = await DataInsight.exportExcelReportStatusData(params)
      downFileExcel(
        res.data,
        `${nameFileExcel}${title.time.fromFormat}_${title.time.toFormat}`
      )

      this.setState({
        isLoadingExcel: false,
        visibleModal: false,
      })
    } catch (error) {
      console.error({ error })
      this.setState({
        isLoadingExcel: false,
        visibleModal: false,
      })
    }
  }

  getDataSource = () => {
    const { dataSource } = this.state
    const dataStation = dataSource.reduce((base, current) => {
      const dataMeasuring = current.data.map((dataMeasure, index) => {
        return {
          station: current.station,
          ...dataMeasure.measure,
          ...dataMeasure.data,
          key: `${current.station.key}-${dataMeasure.measure.key}`,
          ...(index === 0 && {
            spanMerge: current.data.length || 0,
            indexMerge: true,
          }),
        }
      })
      return [...base, ...dataMeasuring]
    }, [])

    return dataStation
  }

  handleCancelModal = () => {
    this.setState({
      visibleModal: false,
    })
  }

  onChangeModalExport = e => {
    this.setState({
      langExport: e.target.value,
    })
  }

  getColumns = () => {
    return [
      {
        title: i18n().station,
        dataIndex: 'station.name',
        width: 200,
        render: (value, record) => {
          const obj = {
            children: value,
            props: {},
          }

          if (record.indexMerge) {
            obj.props.rowSpan = record.spanMerge
          } else {
            obj.props.rowSpan = 0
          }

          return obj
        },
      },
      {
        title: i18n().parameter,
        dataIndex: 'name',
      },
      {
        title: i18n().dischargeThreshold,
        align: 'right',
        render: (value, record) => {
          return (
            <div>{getTextFromMinMax(record.minLimit, record.maxLimit)}</div>
          )
        },
      },
      {
        title: i18n().unit,
        dataIndex: 'unit',
      },
      {
        title: i18n().minValue,
        children: [
          {
            title: i18n().value,
            dataIndex: 'min',
            align: 'right',
            render: value => {
              return (
                <div>{isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
              )
            },
          },
          {
            title: i18n().time,
            dataIndex: 'minTime',
            render: value => {
              return (
                <div>{value ? moment(value).format('DD/MM/YYYY') : '-'}</div>
              )
            },
          },
        ],
      },
      {
        title: i18n().maxValue,
        children: [
          {
            title: i18n().value,
            dataIndex: 'max',
            align: 'right',
            render: value => {
              return (
                <div>{isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
              )
            },
          },
          {
            title: i18n().time,
            dataIndex: 'maxTime',
            render: value => {
              return (
                <div>{value ? moment(value).format('DD/MM/YYYY') : '-'}</div>
              )
            },
          },
        ],
      },
      {
        title: i18n().averageValue,
        dataIndex: 'avg',
        align: 'right',
        width: 90,
        render: value => {
          return <div>{isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
        },
      },
      {
        title: i18n().metricReceived,
        children: [
          {
            title: i18n().totalValue,
            dataIndex: 'record',
            align: 'right',
            render: value => {
              return <div>{isNumber(value) ? value : '-'}</div>
            },
          },
          {
            title: i18n().percentData,
            dataIndex: 'obtainedRatio',
            align: 'right',
            render: value => {
              return (
                <div>{isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
              )
            },
          },
        ],
      },
      {
        title: i18n().dataExceedsStandard,
        children: [
          {
            title: i18n().totalValue,
            dataIndex: 'error',
            align: 'right',
            render: value => {
              return <div>{isNumber(value) ? value : '-'}</div>
            },
          },
          {
            title: i18n().percentData,
            dataIndex: 'thresholdRatio',
            align: 'right',
            render: value => {
              return (
                <div>{isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
              )
            },
          },
        ],
      },
    ]
  }

  render() {
    const { visibleModal, langExport } = this.state
    const dataSource = this.getDataSource()

    return (
      <PageContainer>
        <Breadcrumb items={['status_data']} />
        <Clearfix height={16} />
        <SearchForm
          cbSubmit={this.handleSubmit.bind(this)}
          isDatePicker={true}
          ref={this.formSearchRef}
        />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n().title}</Title>

          {this.state.isHaveData && (
            <React.Fragment>
              <Text>
                {translate('avgSearchFrom.table.descriptionStatusData', {
                  from: moment(this.state.from).format(DD_MM_YYYY_HH_MM),
                  to: moment(this.state.to).format(DD_MM_YYYY_HH_MM),
                })}
              </Text>
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                }}
              >
                {protectRole(ROLE.TINH_TRANG_DU_LIEU.EXPORT)(
                  <Button
                    type="primary"
                    icon="file-excel"
                    loading={this.state.isLoadingExcel}
                    onClick={() =>
                      this.setState({
                        visibleModal: true,
                      })
                    }
                  >
                    {translate('avgSearchFrom.tab.exportExcel')}
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
        <Clearfix height={8} />
        <Spin spinning={this.state.isLoading}>
          <Table
            size="small"
            rowKey={record => record.key}
            columns={this.getColumns()}
            bordered={true}
            dataSource={dataSource}
            scroll={{ x: 1000 }}
            locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
            pagination={false}
          />
        </Spin>
        <ModalLangExport
          showModal={visibleModal}
          handleOkModal={this.handleExcel}
          handleCancelModal={this.handleCancelModal}
          onChangeModal={this.onChangeModalExport}
          langExport={langExport}
        />
      </PageContainer>
    )
  }
}

function getTextFromMinMax(minLimit = '', maxLimit = '') {
  if (!minLimit && maxLimit) return maxLimit
  if (maxLimit && minLimit) return `${minLimit} - ${maxLimit}`
  else return '-'
}
