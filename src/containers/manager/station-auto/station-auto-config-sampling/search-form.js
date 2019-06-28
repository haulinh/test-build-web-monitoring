/* packages */
import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Row, Col, Select, Input, Button, Icon } from 'antd'
import _ from 'lodash'
import swal from ''
/* util */
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
/* components */
import Breadcrumb from '../breadcrumb'


const { Option } = Select

const i18n = {
  selectPlaceholder: 'Chọn loại trạm',
  inputPlaceholder: 'Nhập tên trạm', /* MARK  @translate */
}

@connectAutoDispatch(state => ({
  stationAutos: state.stationAuto.list
}))
@autobind
export default class StationAutoConfigSamplingSearchForm extends React.Component {
  static propTypes = {
    stationAutos: PropTypes.array.isRequired
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      stationTypes: []
    }
  }

  // componentDidMount() {
  //   let stationTypes = this.getStationTypes(this.props.stationAutos)
  //   this.setState({ stationTypes })
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stationAutos.length !== this.props.stationAutos.length) {
      let stationTypes = this.getStationTypes(nextProps.stationAutos)
      this.setState({ stationTypes })
    }
  }

  render() {
    return (
      <Row type="flex" align="middle" gutter={16}>

        {/* NOTE  select station type */}
        <Col span={11}>
          <Select
            style={{width: '100%'}}
            placeholder={i18n.selectPlaceholder}
            // showSearch
            // optionFilterProp=""
            // filterOption={(input, option) => {}}
          >
            {this.renderOptions(this.state.stationTypes)}
          </Select>
        </Col>

        {/* NOTE  input station name */}
        <Col span={11}>
          <Input placeholder={i18n.inputPlaceholder} />
        </Col>

        {/* NOTE  button search */}
        <Col span={2}>
          <Button shape="circle" htmlType="submit">
            <Icon type="search" />
          </Button>
        </Col>
      </Row>
    )
  }

  renderOptions(stations) {
    return _.map(stations, station => {
      return <Option key={station._id} value={station._id}>{station.name}</Option>
    })
  }

  getStationTypes(stationAutos) {
    let stationTypes = {}
    _.forEach(stationAutos, station => {

      let stationID = station._id
      let stationInfo = {
        _id: station._id,
        key: station.key,
        name: station.name
      }

      stationTypes[stationID] = stationInfo
    })
    console.log("rrr", _.values(stationTypes))
    return _.values(stationTypes)
  }
}