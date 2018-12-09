import React from 'react'
import * as _ from 'lodash'
import { Select } from 'antd'
import moment from 'moment'
import { fetchWqiData } from 'api/WqiApi'
import ChartAqiView from './ChartView'
import WqiInfo from './wqi-info'

import connectWindowHeight from 'hoc/window-height'
import { translate } from 'hoc/create-lang'

const Option = Select.Option
const day = 7

@connectWindowHeight
export default class InfoComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      station: props.station,
      wqiDays: [],
      wqiKeys: []
    }
  }

  handleChange = async value => {
    let station = _.get(_.keyBy(this.props.wqiList, 'key'), value.key, null)
    // if (station && !_.isEqual(station.key, value.key)) {
    //   this.setState({ station })
    // }
    this.setState({station})
    this.getWqiByStation(station.key, _.get(station,'wqi.receivedAt', moment().toJSON()))
  }

  getWqiByStation = async (key, time) => {
    const rs = await fetchWqiData(key, time)
    const wqiDays = _.get(rs, 'data', [])
    this.setState({wqiDays})
    // let wqiKeys = []
    // _.forEach(wqiDays, item => _.merge(wqiKeys, _.keys(item)))
    // this.setState({ wqiDays, wqiKeys })
  }

  componentDidMount() {
    const station = _.head(this.props.wqiList)
    if (!_.isEmpty(station)) {
      this.getWqiByStation(station.key, _.get(station,'wqi.receivedAt', moment().toJSON()))
      this.setState({ station })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.wqiList, this.props.wqiList) ||
      !_.isEqual(nextState.station, this.state.station) ||
       !_.isEqual(nextState.wqiDays, this.state.wqiDays) ||
      !_.isEqual(nextState.wqiKeys, this.state.wqiKeys)
    )
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.station, this.props.station)) {
      const station = nextProps.station //_.head(nextProps.aqiList)
      if (!_.isEmpty(station)) {
        this.setState({ station })
        this.getWqiByStation(station.key, _.get(station,'wqi.receivedAt', moment().toJSON()))
      }
    }
  }

  renderOptions = () => {
    const defaultValue = _.get(this.state.station, 'key', '')
    return (
      <Select
        value={{
          key: _.get(this.state.station, 'key', ''),
          label: _.get(this.state.station, 'name', '')
        }}
        labelInValue
        defaultValue={{ key: defaultValue || '' }}
        style={{ width: '100%', marginBottom: 16 }}
        onChange={this.handleChange}
      >
        {_.map(this.props.wqiList || [], ({ key, name }) => (
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
          overflow: 'scroll'
        }}
      >
        {this.renderOptions()}

        {/* {
          _.get(this.state.station, 'aqi.time', null) &&
          `${moment(_.get(this.state.station, 'aqi.time')).format(
            'HH:00 DD/MM/YYYY'
          )}`
        } */}
        <WqiInfo station={this.state.station} />
        {_.size(this.state.wqiDays) > 0 && (
          <div
            style={{
              borderRadius: 3,
              display: 'flex',
              alignContent: 'center',
              padding: '4px 8px',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, rgb(29, 137, 206) 0%, rgb(86, 210, 243) 100%)',
              marginTop: 16
            }}
          >
            <span
              style={{
                alignSelf: 'center',
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold'
              }}
            >
              Giá trị WQI
              {/* {translate('aqi.paramsTitle', { day })} */}
            </span>
          </div>
        )}
        {<ChartAqiView wqiDays={this.state.wqiDays} title = {_.get(this.state.station, 'name', '')}/>}
        {/* {_.map(this.state.wqiKeys, item => (
          <ChartAqiView wqiDays={this.state.wqiDays} key={item} title={item} />
        ))} */}
      </div>
    )
  }
}
