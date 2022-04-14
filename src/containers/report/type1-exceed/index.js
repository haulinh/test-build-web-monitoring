import { Button, Col, Form, Row, Spin } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { DD_MM_YYYY, YYYY } from 'constants/format-date'
import ROLE from 'constants/role'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { translate as t } from 'hoc/create-lang'
import translateManual from 'hoc/create-lang'
import protectRole from 'hoc/protect-role/forMenu'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _, { get } from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import styled from 'styled-components'
import { getTimeUTC } from 'utils/datetime'
import { downFileExcel } from 'utils/downFile'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'
import { TableDate, TableYear } from './TableData'
import ModalLangExport from 'components/elements/modal-lang-export'
import createLanguage from 'hoc/create-lang'

export const FIELDS = {
  REPORT_TYPE: 'reportType',
  TIME: 'time',
  PROVINCE: 'province',
  STATION_KEY: 'stationKeys',
  SELECT_TIME: 'selectTime',
  IS_FILTER: 'isFilter',
  TYPE: 'type',
}

const Text = styled.div`
  font-size: ${props => `${props.fontSize}px`};
  font-weight: ${props => `${props.fontWeight}`};
`

export function i18n() {
  return {
    reportType: {
      label: t('report.label.reportType'),
      option: {
        year: t('report.type1_exceed.option.reportYear'),
        date: t('report.type1_exceed.option.reportDay'),
      },
    },
    time: {
      label: t('report.label.time'),
      required: t('report.required.time'),
    },
    province: {
      label: t('report.label.province'),
    },
    station: {
      label: t('report.label.station'),
      required: t('report.required.station'),
    },
    excel: {
      title: (value, lang) =>
        translateManual(`report.type1_exceed.excel.${value}`, null, null, lang),
    },
    detailTitle: {
      date: t('report.type1_exceed.detailTitle.reportDay'),
      year: t('report.type1_exceed.detailTitle.reportYear'),
      month: t('report.type1_exceed.detailTitle.reportMonth'),
      from: t('report.type2_flow.range.from'),
      to: t('report.type2_flow.range.to'),
      monthText: t('report.type2_flow.range.month'),
    },
  }
}

@protectRole(ROLE.REPORT_EXCEED.VIEW)
@createLanguage
@Form.create()
export default class ReportExceed extends Component {
  state = {
    data: [],
    loading: false,
    isLoadingExcel: false,
    visableModal: false,
    langExport: 'vi',
  }

  getQueryParams = async () => {
    const { form } = this.props
    const values = await form.getFieldsValue()
    const time = _.get(values, 'time.value')
    let validates = [form.validateFields()]
    if (!time) {
      validates = [
        ...validates,
        form.setFields({
          time: {
            type: _.get(values, 'reportType'),
            value: _.get(values, 'time'),
            errors: [new Error(i18n().time.required)],
          },
        }),
      ]
    }
    const type = values.reportType

    const [valuesForm, valueTime] = await Promise.all(validates)
    if (!valuesForm && !valueTime) return

    const queryParams = {
      year: this.getQueryParamsYear,
      date: this.getQueryParamsDate,
    }
    return queryParams[type]()
  }

  getQueryParamsGeneral = () => {
    const { form } = this.props
    const values = form.getFieldsValue()

    const params = {
      ...values,
      [FIELDS.IS_FILTER]: values[FIELDS.IS_FILTER],
      [FIELDS.STATION_KEY]: values.stationKeys.join(','),
    }
    return params
  }

  getQueryParamsYear = () => {
    const paramsGeneral = this.getQueryParamsGeneral()

    const isYearType = paramsGeneral[FIELDS.TIME].type === 'year'
    const [from, to] = [
      isYearType
        ? getTimeUTC(
            moment(paramsGeneral[FIELDS.TIME].value[0], 'YYYY').startOf('year')
          )
        : getTimeUTC(
            moment(paramsGeneral[FIELDS.TIME].value[0]).startOf('month')
          ),
      isYearType
        ? getTimeUTC(
            moment(paramsGeneral[FIELDS.TIME].value[1], 'YYYY').endOf('year')
          )
        : getTimeUTC(
            moment(paramsGeneral[FIELDS.TIME].value[1]).endOf('month')
          ),
    ]
    const params = {
      ...paramsGeneral,
      from,
      to,
      type: paramsGeneral[FIELDS.TIME].type,
    }
    return params
  }

  getQueryParamsDate = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const params = {
      ...paramsGeneral,
      [FIELDS.TIME]: getTimeUTC(paramsGeneral[FIELDS.TIME].value),
    }
    return params
  }

  getDetailTitle = () => {
    const { form } = this.props
    const values = form.getFieldsValue()

    const reportType = get(values, 'time.type', 'date')
    const time = get(values, 'time.value', [])

    const title = {
      date: `${i18n().detailTitle.date}${moment(time).format(DD_MM_YYYY)}`,
      year: `${i18n().detailTitle.year}${moment(time[0], YYYY).format(YYYY)}`,
      month: `${i18n().detailTitle.month}
      ${i18n().detailTitle.from}
      ${i18n().detailTitle.monthText}
      ${moment(time[0], YYYY).format('MM/YYYY')}
      ${i18n().detailTitle.to}
      ${i18n().detailTitle.monthText}
      ${moment(time[1], YYYY).format('MM/YYYY')}`,
    }

    return title[reportType]
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()

    try {
      this.setState({ loading: true })
      const results = await DataInsight.getExceedData(params.reportType, params)
      this.setState({ data: results, loading: false })
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
    }
  }

  handleExportExceed = async () => {
    const {
      lang: { translateManual },
    } = this.props
    this.setState({
      isLoadingExcel: true,
      visableModal: false,
    })
    const params = await this.getQueryParams()
    const result = await DataInsight.getExportReportExceed(params.reportType, {
      ...params,
      lang: this.state.langExport,
    })
    this.setState({
      isLoadingExcel: false,
    })

    const time = {
      date: moment(params.time).format('DDMMYYYY'),
      year: params.time.value[0],
      month:
        moment(params.time.value[0]).format('MMYYYY') +
        '_' +
        moment(params.time.value[1]).format('MMYYYY'),
    }

    const type =
      params.reportType === 'date' ? params.reportType : params.time.type

    downFileExcel(
      result.data,
      `${translateManual(
        `report.type1_exceed.excel.${params.reportType}`,
        null,
        null,
        this.state.langExport
      )}${time[type]}`
    )
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

  resetData = () => this.setState({ data: [] })

  render() {
    const { form } = this.props
    const { loading, data, visableModal, langExport } = this.state
    const { time: { type } = {} } = form.getFieldsValue() || {}

    const Report = {
      date: <TableDate data={data} />,
      year: <TableYear data={data} />,
      month: <TableYear data={data} />,
    }
    const getTitle = () => {
      const title = {
        year: t('report.type1_exceed.title.year'),
        date: t('report.type1_exceed.title.date'),
        month: t('report.type1_exceed.title.year'),
      }

      return title[type]
    }

    return (
      <PageContainer>
        <Clearfix height={16} />
        <Breadcrumb items={['type1_exceed']} />
        <Search loading={loading} onSearch={this.handleOnSearch}>
          <BoxShadow>
            <Filter
              loading={loading}
              form={form}
              resetData={this.resetData}
              onSearch={this.handleOnSearch}
            />
          </BoxShadow>
        </Search>
        <Clearfix height={32} />

        <Row gutter={32}>
          <Col span={21}>
            <Row type="flex" justify="center" align="middle">
              <Text fontSize={20} fontWeight={600}>
                {getTitle()}
              </Text>
            </Row>
            <Clearfix height={16} />
            <Row type="flex" justify="center" align="middle">
              <Text fontSize={16} fontWeight={400}>
                {this.getDetailTitle()}
              </Text>
            </Row>
          </Col>
          <Col span={3}>
            <Row type="flex" justify="end">
              {protectRole(ROLE.REPORT_EXCEED.EXPORT)(
                <Button
                  style={{ marginRight: '12px' }}
                  type="primary"
                  onClick={this.handleOkModal}
                  icon="file-excel"
                  loading={this.state.isLoadingExcel}
                >
                  {t('report.exportExcel')}
                </Button>
              )}
            </Row>
          </Col>
        </Row>
        <Clearfix height={31} />
        <ModalLangExport
          showModal={visableModal}
          handleOkModal={this.handleExportExceed}
          handleCancelModal={this.handleCancelModal}
          onChangeModal={this.onChangeModal}
          langExport={langExport}
        />
        <Spin spinning={this.state.loading}>{Report[type]}</Spin>
        <Clearfix height={50} />
      </PageContainer>
    )
  }
}
