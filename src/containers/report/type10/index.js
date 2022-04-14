import { Button, Typography } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
import { DD_MM_YYYY, MM_YYYY } from 'constants/format-date.js'
import ROLE from 'constants/role'
import createLanguage, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role/forMenu'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get as _get } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { downFileExcel } from 'utils/downFile'
import Breadcrumb from '../breadcrumb'
import { FIELDS, i18n, REPORT_TYPE, TIME } from './constants'
import SearchForm from './Form'
import TableMonitoring from './Table/TableMonitoring'
import TableObtained from './Table/TableObtained'

const { Title, Text } = Typography

@protectRole(ROLE.TILE_DULIEU_THUDUOC.VIEW)
@connect(state => ({
  timeZone: _get(state, 'auth.userInfo.organization.timeZone', null),
  locale: state.language.locale,
  measuresObj: state.global.measuresObj,
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
      tabKeyActive: '',
    }
    this.tabStationRef = React.createRef()
    this.formSearchRef = React.createRef()
  }

  getParams = () => {
    const { tabKeyActive } = this.state
    const values = this.formSearchRef.current.getFieldsValue()

    const timeValue = {
      [TIME.DATE]: {
        from: moment(values[FIELDS.TIME_VALUE][0])
          .startOf('day')
          .toDate(),
        to: moment(values[FIELDS.TIME_VALUE][1])
          .endOf('day')
          .toDate(),
      },
      [TIME.MONTH]: {
        from: moment(values[FIELDS.TIME_VALUE][0])
          .startOf('month')
          .toDate(),
        to: moment(values[FIELDS.TIME_VALUE][1])
          .endOf('month')
          .toDate(),
      },
    }

    const timeType = values[FIELDS.TIME_TYPE]
    const stationKeys = values[FIELDS.STATION_KEYS]

    const newStationKeys =
      timeType === TIME.DATE
        ? tabKeyActive || stationKeys[0]
        : stationKeys.join(',')

    const params = {
      stationKeys: newStationKeys,
      from: timeValue[timeType].from,
      to: timeValue[timeType].to,
      [FIELDS.TIME_TYPE]: values[FIELDS.TIME_TYPE],
      [FIELDS.REPORT_TYPE]: values[FIELDS.REPORT_TYPE],
    }

    return { params, stationKeys }
  }

  handleSubmit = async () => {
    const { params, stationKeys } = this.getParams()

    this.setState({
      isHaveData: false,
      isLoading: true,
    })

    try {
      const result = await DataInsight.getDataRatio(params)

      this.setState({
        dataSource: result,
        isHaveData: true,
        isLoading: false,
        dataSearch: {
          ...params,
          stationKeys,
        },
        from: moment(params.from).format(
          params[FIELDS.TIME_TYPE] === 'month' ? MM_YYYY : DD_MM_YYYY
        ),
        to: moment(params.to).format(
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

  onChangeTabStation = tabKey => {
    this.setState(
      {
        tabKeyActive: tabKey,
      },
      () => this.handleSubmit()
    )
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
      // reportType,
    } = this.state
    const { measuresObj } = this.props

    const stationKeys = dataSearch.stationKeys

    const timeType = dataSearch[FIELDS.TIME_TYPE]
    const reportType = dataSearch[FIELDS.REPORT_TYPE]

    const TableData = {
      [REPORT_TYPE.BASIC]: (
        <TableObtained
          dataSource={dataSource}
          timeType={timeType}
          loading={isLoading}
          stationKeys={stationKeys}
          stationAutos={stationAutos}
          onChangeTabStation={this.onChangeTabStation}
        />
      ),

      [REPORT_TYPE.ADVANCED]: (
        <TableMonitoring
          timeType={timeType}
          dataSource={dataSource}
          measuresObj={measuresObj}
          loading={isLoading}
          stationKeys={stationKeys}
          stationAutos={stationAutos}
          onChangeTabStation={this.onChangeTabStation}
        />
      ),
    }

    return (
      <PageContainer>
        <Breadcrumb items={['type10']} />
        <Clearfix height={16} />
        <SearchForm
          setReportType={this.setReportType}
          cbSubmit={this.handleSubmit}
          resetData={this.resetData}
          ref={this.formSearchRef}
          setStationAutos={this.setStationAutos}
        />
        <Clearfix height={16} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <Title level={4}>
            {timeType === 'date' ? i18n().titleDay : i18n().title}
          </Title>
          {timeType && <Text>{this.getDetailTitle()}</Text>}
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

        {TableData[reportType]}

        <Clearfix height={50} />
      </PageContainer>
    )
  }
}
