import React from "react"
import * as _ from "lodash"
import { Select } from "antd"
import moment from "moment"
import { fetchAqiByDay } from "api/AqiApi"
// import ChartAqiView from './ChartView'
import AqiInfo from "./aqi-info"

import connectWindowHeight from "hoc/window-height"
import { translate } from "hoc/create-lang"

const Option = Select.Option
const day = 7

@connectWindowHeight
export default class InfoComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      station: props.station,
      aqiDays: [],
      aqiKeys: []
    }
  }

  handleChange = async value => {
    let station = _.get(_.keyBy(this.props.aqiList, 'key'), value.key, null)
    // const station = this.state.station.key
    // console.log(this.state.station.key, value.key, "station")
    if (station && !_.isEqual(station.key, this.state.station.key)) {
      this.setState({ station })
    }

    // this.getAqiByStation(station)
  }

  getAqiByStation = async station => {
    const rs = await fetchAqiByDay(station.key, {
      to: moment(_.get(station, "aqi.receivedAt", new Date())).toJSON(),
      size: 7
    })

    const aqiDays = _.get(rs, "data", [])
    let aqiKeys = []
    _.forEach(aqiDays, item => _.merge(aqiKeys, _.keys(item.measuringLogs)))
    this.setState({ aqiDays, aqiKeys })
  }

  componentDidMount() {
    const station = _.head(this.props.aqiList)
    if (!_.isEmpty(station)) {
      // this.getAqiByStation(station)
      this.setState({ station })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.aqiList, this.props.aqiList) ||
      !_.isEqual(nextState.station, this.state.station) ||
      !_.isEqual(nextState.aqiDays, this.state.aqiDays) ||
      !_.isEqual(nextState.aqiKeys, this.state.aqiKeys)
    )
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.station, this.props.station)) {
      const station = nextProps.station //_.head(nextProps.aqiList)
      if (!_.isEmpty(station)) {
        this.setState({ station })
        // this.getAqiByStation(station)
      }
    }
  }

  renderOptions = () => {
    const defaultValue = _.get(this.state.station, "key", "")
    return (
      <Select
        value={{
          key: _.get(this.state.station, "key", ""),
          label: _.get(this.state.station, "name", "")
        }}
        labelInValue
        defaultValue={{ key: defaultValue || "" }}
        style={{ width: "100%", marginBottom: 16 }}
        onChange={this.handleChange}
      >
        {_.map(this.props.aqiList || [], ({ key, name }) => (
          <Option key={key} value={key}>
            {name}
          </Option>
        ))}
      </Select>
    )
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          height: this.props.windowHeight,
          padding: 16,
          overflow: "scroll"
        }}
      >
        {this.renderOptions()}
        <AqiInfo station={this.state.station} aqiLevel={this.props.aqiLevel} />
        {_.size(this.state.aqiDays) > 0 && (
          <div
            style={{
              borderRadius: 3,
              display: "flex",
              alignContent: "center",
              padding: "4px 8px",
              justifyContent: "center",
              background:"linear-gradient(135deg, rgb(29, 137, 206) 0%, rgb(86, 210, 243) 100%)",
              marginTop: 16
            }}
          >
            <span
              style={{
                alignSelf: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              {translate("aqi.paramsTitle", { day })}
            </span>
          </div>
        )}

        {/* {_.map(this.state.aqiKeys, item => (
          <ChartAqiView aqiDays={this.state.aqiDays} key={item} title={item} />
        ))} */}
      </div>
    )
  }
}
