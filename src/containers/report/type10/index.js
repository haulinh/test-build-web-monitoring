import { Button, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date.js'
import ROLE from 'constants/role'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role/forMenu'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get as _get } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { getTimeUTC } from 'utils/datetime'
import { downFileExcel } from 'utils/downFile'
import Breadcrumb from '../breadcrumb'
import SearchForm from './Form'
import { TableMonth, TabStation } from './TableData'

const { Title, Text } = Typography

export const FIELDS = {
  STATION_KEYS: 'stationKeys',
  STATISTIC: 'statistic',
  TIME_VALUE: 'timeValue',
  TIME_TYPE: 'timeType',
}

export function i18n() {
  return {
    header1: translate('avgSearchFrom.table.header1'),
    header2: translate('avgSearchFrom.table.header2'),
    header3: translate('avgSearchFrom.table.header3'),
    header4: translate('avgSearchFrom.table.header4'),
    header5: translate('avgSearchFrom.table.header5'),
    header6: translate('avgSearchFrom.table.header6'),
    title: translate('avgSearchFrom.table.title'),
  }
}

@protectRole(ROLE.TILE_DULIEU_THUDUOC.VIEW)
@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
}))
export default class ReportType10 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHaveData: false,
      isLoading: false,
      isLoadingExcel: false,
      dataSource: [],
      dataSearch: {},
      from: '',
      to: '',
    }
  }

  // componentDidMount() {
  //   // console.log("ABC", this.props.timeZone);
  //   this.handleSubmit()
  // }

  handleSubmit = async (values = {}) => {
    this.setState({
      isHaveData: false,
      isLoading: true,
    })

    const params = {
      stationKeys: values[FIELDS.STATION_KEYS].join(','),
      from: getTimeUTC(values.from),
      to: getTimeUTC(values.to),
      [FIELDS.TIME_TYPE]: values[FIELDS.TIME_TYPE],
    }

    try {
      const result = await DataInsight.getDataRatio(
        values[FIELDS.TIME_TYPE],
        params
      )
      this.setState({
        dataSource: result,
        isHaveData: true,
        isLoading: false,
        dataSearch: params,
        from: moment(values.from).format(
          params[FIELDS.TIME_TYPE] === 'month' ? MM_YYYY : DD_MM_YYYY
        ),
        to: moment(values.to).format(
          params[FIELDS.TIME_TYPE] === 'month' ? MM_YYYY : DD_MM_YYYY
        ),
      })
    } catch (error) {}
  }

  getTitle = () => {
    const { dataSearch, from, to } = this.state
    const type = dataSearch[FIELDS.TIME_TYPE]
    return translate(
      `avgSearchFrom.table.${
        type === 'month' ? 'descriptionRatioMonth' : 'descriptionRatioDate'
      }`,
      {
        from,
        to,
      }
    )
  }

  hanldeExcel = async () => {
    this.setState({
      isLoadingExcel: true,
    })
    const { timeType, ...param } = this.state.dataSearch

    try {
      let res = await DataInsight.exportDataRatio(timeType, {
        ...param,
        language: this.props.locale,
      })

      this.setState({
        isLoadingExcel: false,
      })
      downFileExcel(res.data, this.getTitle())
    } catch (error) {}
  }

  render() {
    const { dataSource, isLoading, dataSearch } = this.state
    const Report = {
      month: (
        <TableMonth
          dataSource={dataSource}
          loading={isLoading}
          parentProps={this.props}
        />
      ),
      date: <TabStation data={dataSource} loading={isLoading} />,
    }
    const type = dataSearch[FIELDS.TIME_TYPE]
    return (
      <PageContainer>
        <div style={{ height: '100vh' }}>
          <Breadcrumb items={['type10']} />
          <Clearfix height={16} />
          <SearchForm cbSubmit={this.handleSubmit} />
          <Clearfix height={16} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <Title level={4}>{i18n().title}</Title>
            {type && (
              <Text>
                {translate(
                  `avgSearchFrom.table.${
                    type === 'month'
                      ? 'descriptionRatioMonth'
                      : 'descriptionRatioDate'
                  }`,
                  {
                    from: this.state.from,
                    to: this.state.to,
                  }
                )}
              </Text>
            )}
            {this.state.isHaveData && (
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
                    onClick={this.hanldeExcel}
                  >
                    {translate('avgSearchFrom.tab.exportExcel')}
                  </Button>
                )}
              </div>
            )}
          </div>
          <Clearfix height={8} />

          <div>{Report[type]}</div>
        </div>
      </PageContainer>
    )
  }
}
