import { Button, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
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
import createLanguage from 'hoc/create-lang'

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
    titleDay: translate('avgSearchFrom.table.titleDay'),
  }
}

@protectRole(ROLE.TILE_DULIEU_THUDUOC.VIEW)
@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
}))
@createLanguage
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
      stationAutos: [],
      visableModal: false,
      langExport: 'vi',
    }
    this.tabStationRef = React.createRef()
  }

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

    if (values[FIELDS.TIME_TYPE] === 'date') {
      this.setState(
        {
          dataSearch: params,
          isHaveData: true,
          from: moment(values.from).format(
            params[FIELDS.TIME_TYPE] === 'month' ? MM_YYYY : DD_MM_YYYY
          ),
          to: moment(values.to).format(
            params[FIELDS.TIME_TYPE] === 'month' ? MM_YYYY : DD_MM_YYYY
          ),
        },
        () => {
          if (this.tabStationRef) this.tabStationRef.current.onSearch()
        }
      )
      return
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

  getDetailTitle = () => {
    const { dataSearch, from, to } = this.state
    const type = dataSearch[FIELDS.TIME_TYPE]
    const title = translate(
      `avgSearchFrom.table.${
        type === 'month' ? 'descriptionRatioMonth' : 'descriptionRatioDate'
      }`,
      {
        from,
        to,
      }
    )

    return title
  }

  hanldeExcel = async () => {
    const {
      lang: { translateManual },
    } = this.props
    this.setState({
      isLoadingExcel: true,
    })
    const { timeType, ...param } = this.state.dataSearch

    try {
      let res = await DataInsight.exportDataRatio(timeType, {
        ...param,
        lang: this.state.langExport,
      })

      this.setState({
        isLoadingExcel: false,
        visableModal: false,
      })

      const fromFormat =
        timeType === 'month'
          ? moment(param.from).format('MMYYYY')
          : moment(param.from).format('DDMMYYYY')

      const toFormat =
        timeType === 'month'
          ? moment(param.to).format('MMYYYY')
          : moment(param.to).format('DDMMYYYY')

      const titleName = translateManual(
        'report.typeRatio.titleExport',
        null,
        null,
        this.state.langExport
      )

      downFileExcel(res.data, `${titleName}${fromFormat}_${toFormat}`)
    } catch (error) {}
  }

  handleOkModal = e => {
    this.setState({
      visableModal: true,
    })
  }

  handleCancelModal = e => {
    this.setState({
      isLoadingExcel: false,
      visableModal: false,
    })
  }

  onChangeModal = e => {
    this.setState({
      langExport: e.target.value,
    })
  }

  resetData = () => this.setState({ dataSource: [] })
  setStationAutos = stationAutos => this.setState({ stationAutos })

  render() {
    const {
      dataSource,
      isLoading,
      dataSearch,
      stationAutos,
      visableModal,
      langExport,
    } = this.state
    const stationKeys = dataSearch.stationKeys
      ? dataSearch.stationKeys.split(',')
      : []

    const type = dataSearch[FIELDS.TIME_TYPE]

    return (
      <PageContainer>
        <Breadcrumb items={['type10']} />
        <Clearfix height={16} />
        <SearchForm
          cbSubmit={this.handleSubmit}
          resetData={this.resetData}
          setStationAutos={this.setStationAutos}
        />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>
            {type === 'date' ? i18n().titleDay : i18n().title}
          </Title>
          {type && <Text>{this.getDetailTitle()}</Text>}
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
                  style={{ marginRight: 16 }}
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
        <ModalLangExport
          showModal={visableModal}
          handleOkModal={this.hanldeExcel}
          handleCancelModal={this.handleCancelModal}
          onChangeModal={this.onChangeModal}
          langExport={langExport}
        />
        <TableMonth
          hidden={type !== 'month'}
          dataSource={dataSource}
          loading={isLoading}
          parentProps={this.props}
        />
        <TabStation
          stationAutos={stationAutos}
          hidden={type !== 'date'}
          ref={this.tabStationRef}
          dataSearch={dataSearch}
          stationKeys={stationKeys}
        />
        <Clearfix height={50} />
      </PageContainer>
    )
  }
}
