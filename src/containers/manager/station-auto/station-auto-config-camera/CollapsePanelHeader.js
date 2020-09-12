import React from 'react'
import { Row, Col, Checkbox, Icon } from 'antd'
import _ from 'lodash'
import { enableCamera } from 'api/CameraApi'

class CollapsePanelHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numOfCameras: _.get(props.station, 'options.camera.list', []).length,
    }
    this[props.station._id] = React.createRef
  }

  setNumOfCameras = quantity => {
    this.setState({ numOfCameras: quantity })
  }

  async _handleChangedStationCheckbox(e) {
    e.stopPropagation()
    const { id, checked } = e.target
    const stationId = id.split('.')[1]

    await enableCamera(stationId, checked)
  }

  render() {
    const { station } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Row type="flex" justify="center" align="middle">
        <Col span={8}>{`${station.stt}  ${station.name}`}</Col>
        <Col span={12}>{station.address}</Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          {getFieldDecorator(`stations.${station._id}`, {
            initialValue: _.get(station, 'options.camera.allowed'),
            valuePropName: 'checked',
            onChange: this._handleChangedStationCheckbox,
          })(<Checkbox onClick={e => e.stopPropagation()} />)}
        </Col>
        <Col span={1}>
          {this.state.numOfCameras} <Icon type="camera" />
        </Col>
      </Row>
    )
  }
}

export default CollapsePanelHeader
