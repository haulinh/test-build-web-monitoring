import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { withRouter } from "react-router"

import { getStationAuto } from "api/StationAuto"

import { translate } from "hoc/create-lang"
import { Row, Col, Radio } from "antd"
import Chart from "./Chart"
import { Clearfix } from "containers/fixed-map/map-default/components/box-analytic-list/style"

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const BieuDoMonitoringWrapper = styled.div`
  flex: 1;
  padding: 8px;
`

const defaultChartType = "hours"

const i18n = {
  avgHour: translate("monitoring.moreContent.chart.tab.avgHour"),
  avgDay: translate("monitoring.moreContent.chart.tab.avgDay")
}

@withRouter
export default class ChartMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {
    stationID: PropTypes.string
  }

  state = {
    isLoading: false,
    stationData: {},
    chartType: ""
  }

  async componentWillMount() {
    this.setState({ isLoading: true })

    const res = await getStationAuto(this.props.stationID)
    if (res.success) {
      this.setState({
        isLoading: false,
        stationData: res.data,
        chartType: defaultChartType
      })
    }
  }
  handleChartTypeOnChange = e => {
    this.setState({ isLoading: true })
    let tempType = this.state.chartType
    if (e.target.value) {
      tempType = e.target.value
    } else {
      tempType = defaultChartType
    }

    this.setState({
      isLoading: false,
      chartType: tempType
    })
  }

  render() {
    // console.log(this.props.stationID, "stationID")
    return (
      <BieuDoMonitoringWrapper className="">
        <Row>
          <Col span={12}>
            <RadioGroup
              buttonStyle="solid"
              defaultValue={defaultChartType}
              onChange={this.handleChartTypeOnChange}
              // buttonStyle="solid"
            >
              <RadioButton value="hours">{i18n.avgHour}</RadioButton>
              <RadioButton value="days">{i18n.avgDay}</RadioButton>
            </RadioGroup>
          </Col>
        </Row>
        <Clearfix height={8} />
        {!this.state.isLoading && (
          <Row>
            <Col span={24}>
              <Chart
                stationData={this.state.stationData}
                chartType={this.state.chartType}
              />
            </Col>
          </Row>
        )}
      </BieuDoMonitoringWrapper>
    )
  }
}
