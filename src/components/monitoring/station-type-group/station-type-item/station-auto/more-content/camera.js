/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import {
  Row, Col
} from 'antd'
/* user import */
import { translate } from 'hoc/create-lang'

@withRouter
export default class CameraMoreInfo extends React.Component {
  static propTypes = {
    stationInfo: PropTypes.object.isRequired
  }

  static defaultProps = {}

  state = {}


  render(){
    let cameras = this.props.stationInfo.options.camera.list
    return (
      <Row type="flex" justify="center" align="middle" gutter={16} style={{height: '100%'}}>
        <Col span={12}>
          <video controls src={cameras[0].rtspUrl} style={{width: '100%'}}/>
        </Col>
        <Col span={12}>
          <video controls src={cameras[0].rtspUrl} style={{width: '100%'}}/>
        </Col>
      </Row>
    )
  }
}