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
import { DD_MM_YYYY, DD_MM_YYYY_HH_MM, HH_MM } from 'constants/format-date.js'
import { Typography, Spin, Table, Divider, Button } from 'antd'
import { get as _get } from 'lodash'
import Clearfix from 'components/elements/clearfix'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { connect } from 'react-redux'
import protectRole from 'hoc/protect-role/forMenu'
import ROLE from 'constants/role'
import { getLanguage } from 'utils/lang'

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
  locale: state.language.locale,
}))
export default class StatusDataReport extends React.Component {
  state = {
    isHaveData: false,
    isLoading: false,
    isLoadingExcel: false,
    dataSource: [],
    stationAutos: [],
    from: null,
    to: null,
  }

  async handleSubmit(values) {
    this.setState({
      isHaveData: false,
      isLoading: true,
      stationAutos: values.stationAutos,
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
        from: values.time[0],
        to: values.time[1],
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
      to,
      getLanguage(this.props.locale)
    )
    if (url) {
      this.setState({ isLoadingExcel: false })
      window.open(url)
    }
  }

  getColumns = () => {
    return [
      {
        title: i18n.station,
        dataIndex: 'name',
        align: 'center',
        width: 100,
        fixed: 'left',
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
        width: 80,
        key: '2',
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
        dataIndex: 'measuringList',
        align: 'center',
        width: 80,
        key: '3',
        render: measuringList => {
          return (
            <div style={{ textAlign: 'center' }}>
              {measuringList &&
                measuringList.map((item, index) => (
                  <div key={item.key}>
                    <span>
                      {getTextFromMinMax(item.minLimit, item.maxLimit)}
                    </span>
                    {index !== measuringList.length - 1 && (
                      <Divider style={{ margin: 0 }} />
                    )}
                  </div>
                ))}
            </div>
          )
        },
      },
      {
        title: i18n.unit,
        dataIndex: 'analyze',
        align: 'center',
        key: '4',
        width: 80,
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
            width: 100,
            key: 'minValue',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.min.data && item.min.data.length ? (
                        <span>
                          {getFormatNumber(item.min.data[0].value, ROUND_DIGIT)}
                        </span>
                      ) : (
                        '-'
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
            width: 180,
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.min.data && (
                        <span>
                          {item.min.data.length ? (
                            <DateRender
                              receivedAt={item.min.data[0].receivedAt}
                              timeZone={_get(this.props, 'timeZone.value', '')}
                            />
                          ) : (
                            '-'
                          )}
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
            key: 'maxValue',
            width: 100,
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.max.data && item.max.data.length ? (
                        <span>
                          {getFormatNumber(item.max.data[0].value, ROUND_DIGIT)}
                        </span>
                      ) : (
                        '-'
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
            width: 180,
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      {item.max.data && (
                        <span>
                          {item.max.data.length ? (
                            <DateRender
                              receivedAt={item.max.data[0].receivedAt}
                              timeZone={_get(this.props, 'timeZone.value', '')}
                            />
                          ) : (
                            '-'
                          )}
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
        width: 100,
        key: '11',
        render: value => {
          return (
            <div style={{ textAlign: 'center' }}>
              {value.map((item, index) => (
                <div key={item.key}>
                  {item.avg.data && item.avg.data.length ? (
                    <span>
                      {getFormatNumber(item.avg.data[0].value, ROUND_DIGIT)}
                    </span>
                  ) : (
                    '-'
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
            title: i18n.totalValue,
            dataIndex: 'totalFact',
            align: 'center',
            width: 100,
            key: '13',
            render: (noUse, record) => {
              const analyze = record.analyze
              return (
                <div style={{ textAlign: 'center' }}>
                  {analyze.map((item, index) => (
                    <div key={item.key}>
                      <span>{!isNaN(item.count) ? item.count : '-'}</span>
                      {index !== analyze.length - 1 && (
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
            dataIndex: 'percentage',
            align: 'center',
            width: 80,
            key: '14',
            render: (noUse, record) => {
              const analyze = record.analyze
              return (
                <div style={{ textAlign: 'center' }}>
                  {analyze.map((item, index) => (
                    <div key={item.key}>
                      <span>
                        {getFormatNumber(item.percentageReceived, ROUND_DIGIT)}
                      </span>
                      {index !== analyze.length - 1 && (
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
        title: i18n.dataExceedsStandard,
        key: '15',
        children: [
          {
            title: i18n.totalValue,
            dataIndex: 'analyze',
            align: 'center',
            width: 100,
            key: '16',
            render: value => {
              return (
                <div style={{ textAlign: 'center' }}>
                  {value.map((item, index) => (
                    <div key={item.key}>
                      <span>
                        {!isNaN(item.totalVuotNguong)
                          ? item.totalVuotNguong
                          : '-'}
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
          {
            title: i18n.percentData,
            dataIndex: 'analyze',
            align: 'center',
            width: 100,
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
        width: 100,
      },
      {
        title: i18n.note,
        align: 'center',
        width: 100,
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
            scroll={{ x: 1000 }}
            locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
            pagination={false}
          />
        </Spin>
      </PageContainer>
    )
  }
}

function getTextFromMinMax(minLimit = '', maxLimit = '') {
  if (!maxLimit && !minLimit) return <span>&nbsp;</span>
  if (maxLimit && minLimit) return `${minLimit} - ${maxLimit}`
  else return maxLimit || minLimit
}

const DateRender = props => {
  if (!props.receivedAt) return '-'
  const timeM = moment(props.receivedAt).tz(props.timeZone)
  const dateStr = timeM.format(DD_MM_YYYY)
  const timeStr = timeM.format(HH_MM)
  return `${dateStr} ${timeStr}`
  // return (
  //   <span>
  //     {dateStr} <br /> {timeStr}
  //   </span>
  // )
}
