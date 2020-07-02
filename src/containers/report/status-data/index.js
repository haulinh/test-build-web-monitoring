import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import SearchForm from './search-form'
import {
  getUrlReportStatusData,
  getUrlReportStatusDataExcel,
} from 'api/DataStationAutoApi'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date.js'
import { Typography, Spin, Table, Divider, Button } from 'antd'
import { get as _get } from 'lodash'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { connect } from 'react-redux'
import protectRole from 'hoc/protect-role/forMenu'
import ROLE from 'constants/role'

const { Title, Text } = Typography
const i18n = {
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
@protectRole(ROLE.TINH_TRANG_DU_LIEU.VIEW)
@connect(state => ({
  token: state.auth.token,
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
}))
export default class StatusDataReport extends React.Component {
  state = {
    isHaveData: false,
    isLoading: false,
    isLoadingExcel: false,
    dataSource: [],
    stationAutos: [],
    from: '',
    to: '',
  }

  async handleSubmit(values) {
    this.setState({
      isHaveData: false,
      isLoading: true,
      stationAutos: values.stationAutos,
      from: values.time[0],
      to: values.time[1],
    })
    const res = await getUrlReportStatusData(
      values.stationAutos,
      values.time[0],
      values.time[1]
    )
    if (res.success) {
      this.setState({
        dataSource: res.data,
        isHaveData: true,
        isLoading: false,
      })
    }
  }

  handleExcel = async () => {
    const { stationAutos, from, to } = this.state
    this.setState({
      isLoadingExcel: true,
    })

    let url = await getUrlReportStatusDataExcel(
      this.props.token,
      stationAutos,
      from,
      to
    )
    window.open(url)
  }

  getColumns = () => {
    return [
      {
        title: i18n.station,
        dataIndex: 'name',
        align: 'center',
        key: '1',
        render: value => {
          return (
            <div style={{ marginLeft: '5px', textAlign: 'left' }}>{value}</div>
          )
        },
      },
      {
        title: i18n.parameter,
        align: 'center',
        dataIndex: 'analyze',
        key: '2',
        width: 300,
        render: value => {
          if (!value) {
            return null
          }
          return (
            <div style={{ textAlign: 'center' }}>
              {value.map((item, index) => (
                <div key={item.key}>
                  <span>{item.key}</span>
                  {index !== value.length - 1 && (
                    <Divider style={{ margin: 0 }} />
                  )}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        title: i18n.dischargeThreshold,
        dataIndex: 'dataFrequency',
        align: 'center',
        key: '3',
        // render: value => {
        //   return (
        //     <div style={{ textAlign: 'right' }}>
        //       {getFormatNumber(value, 0)}
        //     </div>
        //   )
        // },
      },
      {
        title: i18n.unit,
        dataIndex: 'analyze',
        align: 'center',
        key: '4',
        render: value => {
          return (
            <div style={{ textAlign: 'center' }}>
              {value.map((item, index) => (
                <div key={item.key}>
                  <span>{item.unit ? item.unit : '-'}</span>
                  {index !== value.length - 1 && (
                    <Divider style={{ margin: 0 }} />
                  )}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        title: i18n.minValue,
        key: '5',
        children: [
          {
            title: i18n.value,
            dataIndex: 'analyze',
            align: 'center',
            key: '6',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.min.data && item.min.data.length && (
                        <span>
                          {getFormatNumber(item.min.data[0].value, 0)}
                        </span>
                      )}
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
          {
            title: i18n.time,
            dataIndex: 'analyze',
            align: 'center',
            key: '7',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.min.data && (
                        <span>
                          {item.min.data.length
                            ? moment(item.min.data[0].receivedAt)
                                .tz(_get(this.props, 'timeZone.value', ''))
                                .format(DD_MM_YYYY)
                            : '-'}
                        </span>
                      )}
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
        ],
      },
      {
        title: i18n.maxValue,
        key: '8',
        children: [
          {
            title: i18n.value,
            dataIndex: 'analyze',
            align: 'center',
            key: 'minValue',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.max.data && item.max.data.length && (
                        <span>
                          {getFormatNumber(item.max.data[0].value, ROUND_DIGIT)}
                        </span>
                      )}
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
          {
            title: i18n.time,
            dataIndex: 'analyze',
            align: 'center',
            key: 'minTime',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.max.data && (
                        <span>
                          {item.max.data.length
                            ? moment(item.max.data[0].receivedAt)
                                .tz(_get(this.props, 'timeZone.value', ''))
                                .format(DD_MM_YYYY)
                            : '-'}
                        </span>
                      )}
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
        ],
      },
      {
        title: i18n.averageValue,
        dataIndex: 'analyze',
        align: 'center',
        key: '11',
        render: value => {
          return (
            <div style={{ textAlign: 'center' }}>
              {value.map((item, index) => (
                <div key={item.key}>
                  {item.avg.data && item.avg.data.length && (
                    <span>
                      {getFormatNumber(item.avg.data[0].value, ROUND_DIGIT)}
                    </span>
                  )}
                  {index !== value.length - 1 && (
                    <Divider style={{ margin: 0 }} />
                  )}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        title: i18n.metricReceived,
        key: '12',
        children: [
          {
            title: 'Tổng số giá trị',
            dataIndex: 'totalFact',
            align: 'center',
            key: '13',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <span>{value}</span>
                </div>
              )
            },
          },
          {
            title: i18n.percentData,
            dataIndex: 'percentage',
            align: 'center',
            key: '14',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <span>{getFormatNumber(value, ROUND_DIGIT)}</span>
                </div>
              )
            },
          },
        ],
      },
      {
        title: i18n.dataExceedsStandard,
        key: '15',
        children: [
          {
            title: i18n.totalValue,
            dataIndex: 'analyze',
            align: 'center',
            key: '16',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      <span>{item.totalVuotNguong}</span>
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
          {
            title: i18n.percentData,
            dataIndex: 'analyze',
            align: 'center',
            key: '17',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      <span>
                        {getFormatNumber(item.persenVuotNguong, ROUND_DIGIT)}
                      </span>
                      {index !== value.length - 1 && (
                        <Divider style={{ margin: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )
            },
          },
        ],
      },
      {
        title: i18n.timeUsuallyExceeds,
        align: 'center',
      },
      {
        title: i18n.note,
        align: 'center',
      },
    ]
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['status_data']} />
        <Clearfix height={16} />
        <SearchForm
          cbSubmit={this.handleSubmit.bind(this)}
          isDatePicker={true}
        />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>{i18n.title}</Title>

          {this.state.isHaveData && (
            <React.Fragment>
              <Text>
                {translate('avgSearchFrom.table.descriptionStatusData', {
                  fromDate: moment(this.state.from).format('DD/MM/YYYY'),
                  toDate: moment(this.state.to).format('DD/MM/YYYY'),
                })}
              </Text>
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                }}
              >
                {protectRole(ROLE.TILE_DULIEU_THUDUOC.EXPORT)(
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
            </React.Fragment>
          )}
        </div>
        <Clearfix height={8} />
        <Spin spinning={this.state.isLoading}>
          <Table
            size="small"
            rowKey="key"
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
