/* libs import */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import _ from 'lodash'
import { Row, Col, Spin, Icon } from 'antd'
/* user import */
import { translate } from 'hoc/create-lang'
import CameraAPI from 'api/CameraApi'
import Disconnection from 'components/elements/disconnection'
@withRouter
export default class CameraMoreInfo extends React.Component {
  static propTypes = {
    stationInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {}

  state = {
    cameras: [],
    isLoading: true,
    isDisconnection: false,
    disconnectionMessage: translate('network.camera.lostConnection'),
  }

  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  async componentDidMount() {
    try {
      let authDigest = await CameraAPI.getAuthToken()
      let cameras = this.props.stationInfo.options.camera.list
      cameras = _.take(cameras, 2) // NOTE  -- chỉ lấy 2 camera đầu để hiển thị
      cameras = cameras.map(_camera => {
        let camera = _.clone(_camera)
        const link = `${camera.rtspUrl}?auth=${authDigest}&resolution=360p&sfd&rt`
        camera.link = link
        return camera
      })
      this.setState({ cameras, isLoading: false })
    } catch (err) {
      console.log('camera lost connection')
      this.setState({ isDisconnection: true })
    }
  }

  _renderCamera = cameras => (
    <Spin
      spinning={this.state.isLoading}
      indicator={<Icon type="loading" style={{ fontSize: 24 }} />}
      style={{ height: 300 }}
    >
      <Row type="flex" gutter={16} style={{ height: '100%' }}>
        {cameras.map((camera, index) => (
          <Col span={12} key={index}>
            <video controls src={camera.link} style={{ width: '100%' }} />
          </Col>
        ))}
      </Row>
    </Spin>
  )

  _renderDisconnection = message => (
    <Row type="flex" justify="center" align="middle">
      <Disconnection messages={this.state.disconnectionMessage} />
    </Row>
  )

  render() {
    let { cameras } = this.state
    return (
      <React.Fragment>
        {this.state.isDisconnection
          ? this._renderDisconnection()
          : this._renderCamera(cameras)}
      </React.Fragment>
    )
  }
}
