import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import { Select, Card } from 'antd';
import moment from 'moment'

import aqiLevel from '../../../constants/aqi-level'
import { fetchAqiByDay } from '../../../api/AqiApi'

import connectWindowHeight from 'hoc/window-height'

const Option = Select.Option;

const AqiView = styled.div`
  background: ${props =>  props.color || 'green'};
  height: 80px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const VnAqiView = ({value, color}) => {
  const level = _.find(aqiLevel, ({min, max}) => _.inRange(value, min, max))
  color = _.get(level, 'color', null)
  return (
    <AqiView color={color}>
      <span style={{fontSize: 40, color: '#fff', fontWeight: '600'}}>VN AQI {value}</span>
    </AqiView>
  )
}

const day = 7

@connectWindowHeight
export default class InfoComponent extends React.Component {


  state = {
    station: null
  }

  handleChange = async (value) => {
    let station = _.get(_.keyBy(this.props.aqiList, '_id'), value.key, null)
    this.setState({ station })
    const from = moment().subtract(day, 'days').format('YYYY/MM/YY')
    const rs = await fetchAqiByDay(value.key, {from: '2018/09/10', to:'2018/09/15'})
    

    let result = _.get(rs, 'data.aqi', [])
    result = _.map(result, ({aqiDayOf}) => {
      return _.values(_.get(aqiDayOf, {}))
    })

    console.log('aqi day',rs, result)
  }

  componentDidMount () {
    if (_.head(this.props.aqiList)) {
      this.setState({station: _.head(this.props.aqiList)})
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !_.isEqual(nextProps.aqiList, this.props.aqiList) || 
           !_.isEqual(nextState.station, this.state.station) 
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.aqiList, this.props.aqiList)) {
      if (_.head(nextProps.aqiList)) {
        this.setState({station: _.head(nextProps.aqiList)})
      }
    }
  }

  renderOptions = () => {
    return (
      <Select labelInValue defaultValue={{ key: _.get(this.state.station, '_id', '') }} style={{ width: '100%', marginBottom: 16 }} onChange={this.handleChange}>
        {
          _.map(this.props.aqiList || [], ({_id, name}) => <Option key={_id} value={_id}>{name}</Option>)
        }
      </Select>
    )
  }

  render () {

    return (
      <div style={{...this.props.style, height: this.props.windowHeight, padding: 16}}>
        {
          this.renderOptions()
        }
        
        {
          _.get(this.state.station, 'aqi.time', null) && `${moment(_.get(this.state.station, 'aqi.time')).format('HH:mm DD/MM/YYYY')}`
        }
        <VnAqiView value={_.get(this.state.station, 'aqi.value', '')}/>
        <h5>
          Chỉ số chất lượng của thông số {day} ngày
        </h5>
      </div>
    ) 
  }
}