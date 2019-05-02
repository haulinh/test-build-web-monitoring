/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import _ from 'lodash'
import {
  Row, Col, Spin, Icon
} from 'antd'
/* user import */
import { translate } from 'hoc/create-lang'
import CameraAPI from 'api/CameraApi'

@withRouter
export default class CameraMoreInfo extends React.Component {
  static propTypes = {
    stationInfo: PropTypes.object.isRequired
  }

  static defaultProps = {}

  state = {
    cameras: []
  }

  constructor(props) {
    super(props)
    this.componentWillMount = this.componentWillMount.bind(this)
  }

  async componentWillMount() {
    let authDigest = await CameraAPI.getAuthToken()
    let cameras = this.props.stationInfo.options.camera.list
    cameras = _.take(cameras, 2) // NOTE  -- chỉ lấy 2 camera đầu để hiển thị
    cameras = cameras.map( _camera => {
      let camera = _.clone(_camera)
      const link = `${camera.rtspUrl}?auth=${authDigest}&resolution=360p&sfd&rt`
      camera.link = link
      return camera
    })
    this.setState({cameras})
  }

  render(){
    let { cameras } = this.state
    console.log(' --- cameras ---: ', cameras)
    // NOTE  -- TEST LINK "http://35.247.172.138:7001/media/c25efecb-d465-6122-1e28-ef56f2865856.webm?auth=YWRtaW46NTg3ZGYzZmRjMDU5MDozYTI5ZjhjMjI0MTU0YTFjNzhjODZmZTQ0ZWQ4MTNmZQ==&resolution=360p&sfd&rt"
    return (
      <Row type="flex" gutter={16} style={{height: '100%'}}>
        { cameras.length !== 0 ? (
          cameras.map( camera => (
            <Col span={12}>
              <video controls src={camera.link} style={{width: '100%'}}/>
            </Col>
          ))
        ) : (
          <Spin 
            indicator={<Icon type="loading" style={{fontSize: 24}} />}
          />
        )}
      </Row>
    )
  }
}