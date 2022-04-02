import { Button, Col, Form, message, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import dataInsightApi from 'api/DataInsight'
import { FilterList, ModalSaveFilter } from 'components/filter'
import { ACTION_TYPE, MODULE_TYPE } from 'components/filter/constants'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import slug from 'constants/slug'
import { translate as t } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { get, isEmpty } from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connectAutoDispatch } from 'redux/connect'
import {
  addBreadcrumb,
  deleteBreadcrumb,
  updateBreadcrumb,
} from 'shared/breadcrumb/action'
import Breadcrum from './breadcrum'
import { AnalyzeDataProvider } from './context'
import FilterForm from './filter'
import { OPERATOR } from './filter/select-operator'
import ReportData from './report-data'
import { CHART_TYPE } from './report-data/chart-type'

function i18n() {
  return {
    title: t('menuApp.monitoring.dataAnalytics'),
    measuredValue: t('dataAnalytics.measuredValue'),
  }
}

@connectAutoDispatch(
  state => ({
    breadcrumbs: state.breadcrumbs,
  }),
  { updateBreadcrumb, addBreadcrumb, deleteBreadcrumb }
)
@withRouter
@Form.create()
class DataAnalytics extends Component {
  chart

  state = {
    data: {},
    qcvns: [],
    measure: null,
    measuringList: {},
    dataType: OPERATOR.AVG,
    chartType: CHART_TYPE.COLUMN,
    isLoadingData: false,
    isShowQcvn: true,
    paramFilter: {},
    filterList: [],
    visibleModalSave: false,
    filterItem: {},
  }

  formSearchRef = React.createRef()

  setLoading = isLoadingData => this.setState({ isLoadingData })

  componentDidMount = () => {
    // const { history, deleteBreadcrumb } = this.props

    this.getFilterList()

    // history.listen((location, action) => {
    //   console.log('History listen')
    //   // console.log({ location })
    //   // if (!location.state) {
    //   //   deleteBreadcrumb({
    //   //     id: 'detail',
    //   //     // autoDestroy: true,
    //   //   })
    //   // }
    // })
  }

  getFilterList = async () => {
    try {
      const response = await CalculateApi.getFilterList({
        type: MODULE_TYPE.ANALYTIC,
      })

      this.setState({ filterList: response })
    } catch (error) {
      console.error({ error })
    }
  }

  onData = (result, { dataType, from, to }) => {
    if (isEmpty(result.data)) {
      this.chart.removeCharts([], true)
      this.setState({
        measure: null,
        data: result.data || {},
        measuringList: result.measuringList,
      })
      return
    }
    const measure = Object.keys(result.data)[0]
    this.setState(
      {
        from,
        to,
        data: result.data,
        dataType,
        measure,
        measuringList: result.measuringList,
      },
      () => this.onFetchReceiveTime(measure)
    )
  }

  removeAllLine = () => {
    const { qcvns } = this.state
    qcvns.forEach(item => {
      const { name } = item
      this.chart.removeCharts([
        this.chartId(name, 'min'),
        this.chartId(name, 'max'),
      ])
    })
  }

  onReDrawChart = (params = {}) => {
    this.removeAllLine()

    let { data, measure, dataType, chartType, qcvns } = this.state
    measure = params.measure || measure
    dataType = params.dataType || dataType
    chartType = params.chartType || chartType

    this.setState({ measure, dataType, chartType }, () => {
      this.onChangeQcvn(qcvns)
      this.chart.setTitle({
        text: this.getChartTitle(),
      })
    })

    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return

    const getDescription = item => {
      if (![OPERATOR.MAX, OPERATOR.MIN].includes(dataType)) return null
      return item.analyzeData.times || []
    }
    const series = (data[measure] || []).map(item => ({
      y: item.analyzeData[dataType],
      description: getDescription(item),
    }))
    const categories = (data[measure] || []).map(item => item.stationName)
    this.chart.addSeries(
      categories,
      {
        id: 'mainChart',
        data: series,
        type: chartType,
        name: i18n().measuredValue,
        enableMouseTracking: [OPERATOR.MIN, OPERATOR.MAX].includes(dataType),
      },
      true
    )
  }

  onChangeQcvn = (qcvns, redraw = true) => {
    const { chartType, measure: measureKey, qcvns: oldQcvns } = this.state
    this.setState({ qcvns })
    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return
    if (!measureKey) return
    // remove line
    oldQcvns.forEach(qcvn => {
      const { name } = qcvn
      if (!qcvns.find(item => item.name === name)) {
        this.chart.removeCharts([
          this.chartId(name, 'max'),
          this.chartId(name, 'min'),
        ])
      }
    })

    // add line
    qcvns.forEach(qcvn => {
      const { name, measuringList } = qcvn
      const measure = measuringList.find(measure => measure.key === measureKey)
      if (!measure) return
      if (measure.maxLimit || measure.maxLimit === 0)
        this.chart.drawLine({
          name,
          id: this.chartId(name, 'max'),
          value: measure.maxLimit,
        })
      if (measure.minLimit || measure.minLimit === 0)
        this.chart.drawLine({
          name,
          id: this.chartId(name, 'min'),
          value: measure.minLimit,
        })
    })
    if (redraw) this.chart.redraw()
  }

  onSubmitSaveFilter = async () => {
    const { form } = this.props
    const { filterItem } = this.state

    const value = await form.validateFields()

    const queryParams = this.getParams()

    const action = value.action

    try {
      if (action === ACTION_TYPE.UPDATE) {
        await CalculateApi.updateFilter(filterItem._id, queryParams)
        message.success('Cập nhật bộ lọc thành công')
      } else {
        await CalculateApi.createFilter(queryParams)

        message.success('Lưu bộ lọc thành công')
      }

      this.getFilterList()
      this.setState({ visibleModalSave: false })
    } catch (error) {
      console.error({ error })
    }
  }

  getParams = () => {
    const { form } = this.props

    const { props } = this.formSearchRef.current

    const valueFormSearch = props.form.getFieldsValue()

    const measuringList = valueFormSearch.measuringList.join(',')

    const stationKeys = valueFormSearch.stationAuto.join(',')

    console.log({ valueFormSearch })
    const filterName = form.getFieldValue('name')

    const queryParams = {
      type: MODULE_TYPE.ANALYTIC,
      name: filterName,
      params: {
        ...valueFormSearch,
        measuringList,
        stationKeys,
      },
    }

    return queryParams
  }

  onFetchReceiveTime = async measure => {
    const { data, dataType, from, to, paramFilter } = this.state
    this.setState({ measure })

    this.onReDrawChart({ measure })

    if (![OPERATOR.MAX, OPERATOR.MIN].includes(dataType)) return

    if (!isEmpty(get(data[measure], '[0].analyzeData.times', []))) {
      return
    }

    const result = await dataInsightApi.getReceiveTime({
      to,
      from,
      measure,
      stations: data[measure].map(item => item.stationKey).join(','),
      values: data[measure].map(item => item.analyzeData[dataType]).join(','),
      isFilter: paramFilter.isFilter,
    })

    const chart = this.chart.getChartSeries('mainChart')
    const getTimes = list =>
      list.map(item => moment(item).format(DD_MM_YYYY_HH_MM))
    let timeInterval = setInterval(() => {
      if (!chart.finishedAnimating) return
      this.setState({
        measure,
        data: {
          ...data,
          [measure]: data[measure].map(item => ({
            ...item,
            analyzeData: {
              ...item.analyzeData,
              times: getTimes(result[item.stationKey]),
            },
          })),
        },
      })
      this.chart.getChartSeries('mainChart').setData(
        data[measure].map(item => ({
          y: item.analyzeData[dataType],
          description: getTimes(result[item.stationKey]),
        })),
        true
      )
      clearInterval(timeInterval)
    }, 200)
  }

  chartId = (name, type) => `${name}_${type}`

  getChartTitle = () => {
    const { measuringList, measure } = this.state
    if (!measuringList[measure]) return ''
    return `${measuringList[measure].name} ${
      measuringList[measure].unit ? `(${measuringList[measure].unit})` : ''
    }`
  }

  setChart = chart => {
    this.chart = chart
  }

  setParamFilter = paramFilter => {
    this.setState({
      paramFilter,
    })
  }

  toogleSelectQcvns = toogle => {
    this.setState({ isShowQcvn: toogle })
  }

  onClickSaveFilter = () => {
    this.setState({ visibleModalSave: true })
  }

  onCancelModal = () => {
    this.setState({ visibleModalSave: false })
  }

  onClickFilter = (filterId, filterItem) => {
    this.setState({ filterItem })
    // const {
    //   breadcrumbs,
    //   updateBreadcrumb,
    //   addBreadcrumb,
    //   deleteBreadcrumb,
    //   history,
    // } = this.props

    // const url = `${slug.dataAnalytics.base}/${filterId}`
    // if (breadcrumbs.length === 2) {
    //   updateBreadcrumb({
    //     id: 'detail',
    //     icon: '',
    //     href: url,
    //     name: filterItem.name,
    //     autoDestroy: true,
    //   })
    // } else {
    //   addBreadcrumb({
    //     id: 'detail',
    //     icon: '',
    //     href: url,
    //     name: filterItem.name,
    //     autoDestroy: true,
    //   })
    // }
    // history.push(url, { filterId })

    const params = filterItem.params
    const { form } = this.formSearchRef.current.props
    form.setFieldsValue({
      ...params,
      measuringList: params.measuringList.split(','),
    })
    this.formSearchRef.current.handleSearch()
  }

  onDelete = () => {
    const { deleteBreadcrumb } = this.props

    deleteBreadcrumb({
      id: 'detail',
    })
  }

  onDeleteFilter = async filterId => {
    const { filterList } = this.state

    try {
      await CalculateApi.deleteFilter(filterId)
      const newFilterList = filterList.filter(filter => filter._id !== filterId)

      this.setState({ filterList: newFilterList })
      message.success('Xóa bộ lọc thành công')
    } catch (error) {
      console.error({ error })
    }
  }

  render() {
    const {
      data,
      qcvns,
      dataType,
      chartType,
      isLoadingData,
      paramFilter,
      measuringList,
      measure,
      isShowQcvn,
      visibleModalSave,
      filterList,
      filterItem,
    } = this.state

    const { form } = this.props

    const isUpdateFilter = !isEmpty(filterItem)
    return (
      <AnalyzeDataProvider
        value={{
          setChart: this.setChart,
          chart: this.chart,
        }}
      >
        <PageContainer
          right={
            <Button type="primary" onClick={this.onClickSaveFilter}>
              Lưu bộ lọc
            </Button>
          }
        >
          <Breadcrum
            items={[
              {
                getName: () => i18n().title,
                id: 'base',
                icon: '',
                href: slug.dataAnalytics.base,
              },
            ]}
          />

          <Row
            type="flex"
            style={{ marginLeft: '-24px', marginRight: '-24px' }}
          >
            <FilterList
              list={filterList}
              onClickMenuItem={this.onClickFilter}
              key={filterList}
              onDeleteFilter={this.onDeleteFilter}
            />
            <Col style={{ flex: 1, overflowX: 'hidden' }}>
              <FilterForm
                standardsVN={qcvns.map(qc => qc.key)}
                isLoadingData={isLoadingData}
                onData={this.onData}
                wrappedComponentRef={this.formSearchRef}
                onReDrawChart={this.onReDrawChart}
                setLoading={this.setLoading}
                setParamFilter={this.setParamFilter}
                toogleSelectQcvns={this.toogleSelectQcvns}
              />
              <ReportData
                isShowQcvn={isShowQcvn}
                measure={measure}
                measuringList={measuringList}
                paramFilter={paramFilter}
                data={data}
                qcvns={qcvns}
                dataType={dataType}
                chartType={chartType}
                isLoadingData={isLoadingData}
                onReDrawChart={this.onReDrawChart}
                onChangeQcvn={this.onChangeQcvn}
                onFetchReceiveTime={this.onFetchReceiveTime}
              />
            </Col>
          </Row>
        </PageContainer>
        <ModalSaveFilter
          filterName={filterItem.name}
          visible={visibleModalSave}
          key={visibleModalSave}
          centered
          isUpdate={isUpdateFilter}
          onCancel={this.onCancelModal}
          onSubmitSaveFilter={this.onSubmitSaveFilter}
          form={form}
        />
      </AnalyzeDataProvider>
    )
  }
}

export default DataAnalytics
