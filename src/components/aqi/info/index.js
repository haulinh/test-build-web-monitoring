import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { Select } from 'antd'
import moment from 'moment'

import aqiLevel from 'constants/aqi-level'
import { fetchAqiByDay } from 'api/AqiApi'
import ChartAqiView from './ChartView'

import connectWindowHeight from 'hoc/window-height'
import { translate } from 'hoc/create-lang'

const Option = Select.Option

const AqiView = styled.div`
  background: ${props => props.color || 'green'};
  height: 80px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const VnAqiView = ({ value, color }) => {
  const level = _.find(aqiLevel, ({ min, max }) => _.inRange(value, min, max))
  color = _.get(level, 'color', null)
  return (
    <AqiView color={color}>
      <span style={{ fontSize: 40, color: '#fff', fontWeight: '600' }}>
        VN AQI {value}
      </span>
    </AqiView>
  )
}

const day = 7

@connectWindowHeight
export default class InfoComponent extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      station: props.station,
      aqiDays: [],
      aqiKeys: []
    }
  }

  handleChange = async value => {
    let station = _.get(_.keyBy(this.props.aqiList, '_id'), value.key, null)
    if (station && !_.isEqual(station.key, value.key)) {
      this.setState({ station })
    }

    this.getAqiByStation(value.key)
  }

  getAqiByStation = async key => {
    const rs = await fetchAqiByDay(key, {
      from: moment()
        .subtract(day, 'days')
        .format('YYYY/MM/DD'),
      to: moment().format('YYYY/MM/DD')
    })

    const aqiDays = _.get(rs, 'data.aqi', [])
    let aqiKeys = []
    _.forEach(aqiDays, item => _.merge(aqiKeys, _.keys(item.aqiDayOf)))
    this.setState({ aqiDays, aqiKeys })
  }

  componentDidMount() {
    const station = _.head(this.props.aqiList)
    if (!_.isEmpty(station)) {
      this.getAqiByStation(station._id)
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
      const station = nextProps.station//_.head(nextProps.aqiList)
      if (!_.isEmpty(station)) {
        this.setState({ station })
        this.getAqiByStation(station._id)
      }
    }
  }

  renderOptions = () => {
    const defaultValue = _.get(this.state.station, '_id', '')
    return (
      <Select
        value={{
          key: _.get(this.state.station, '_id', ''),
          label: _.get(this.state.station, 'name', '')
        }}
        labelInValue
        defaultValue={{ key: defaultValue || '' }}
        style={{ width: '100%', marginBottom: 16 }}
        onChange={this.handleChange}
      >
        {_.map(this.props.aqiList || [], ({ _id, name }) => (
          <Option key={_id} value={_id}>
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

        {_.get(this.state.station, 'aqi.time', null) &&
          `${moment(_.get(this.state.station, 'aqi.time')).format(
            'HH:00 DD/MM/YYYY'
          )}`}
        <VnAqiView value={_.get(this.state.station, 'aqi.value', '')} />
        {_.size(this.state.aqiDays) > 0 && (
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
              {translate('aqi.paramsTitle', { day })}
            </span>
          </div>
        )}

        {_.map(this.state.aqiKeys, item => (
          <ChartAqiView aqiDays={this.state.aqiDays} key={item} title={item} />
        ))}
      </div>
    )
  }
}
