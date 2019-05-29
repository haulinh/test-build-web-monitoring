import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import { getStationAuto } from 'api/StationAuto'

import { translate } from 'hoc/create-lang'
import { Row, Col, Radio } from 'antd'
import Chart from './Chart'
import { Clearfix } from 'containers/fixed-map/map-default/components/box-analytic-list/style'
// import { isEqual as _isEqual } from 'lodash'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const BieuDoMonitoringWrapper = styled.div`
  padding: 8px;
  justify-content: center;
  display: flex;
  flex-direction: column;

  .monitoring-bieudo--Type {
    flex: 1;
  }
  .monitoring-bieudo--Chart {
    flex: 1;
  }
`

const defaultChartType = 'hours'

const i18n = {
  avgHour: translate('monitoring.moreContent.chart.tab.avgHour'),
  avgDay: translate('monitoring.moreContent.chart.tab.avgDay')
}

@withRouter
export default class ChartMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {
    stationID: PropTypes.string
  }

  state = {
    isLoading: true,
    stationData: {},
    chartType: ''
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
      <BieuDoMonitoringWrapper className="monitoring-bieudo">
        <div className="monitoring-bieudo--Type">
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
        </div>
        {!this.state.isLoading && (
          <div className="monitoring-bieudo--Chart">
            <Clearfix height={8} />
            <Chart
              stationData={typeof this.state.stationData === "object" ? this.state.stationData : null}
              chartType={this.state.chartType}
            />
          </div>
        )}
      </BieuDoMonitoringWrapper>
    )
  }
}
