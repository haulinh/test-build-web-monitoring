import React from 'react'
import styled from 'styled-components'
import ListItem from './item'
import * as _ from 'lodash'
import { getAuthToken } from 'api/CameraApi'
import { Empty } from 'antd'
import swal from 'sweetalert2'
import removeUnicodeText from './util'

const WrapperContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 16px 0;
`

export default class CameraList extends React.Component {
  state = {
    isLoaded: false,
    auth: '',
    countStartCamera: 0,
    cameraList: [],
    cameraListNotUnicode: [],
  }

  handleCamera = e => {}

  async componentDidMount() {
    const auth = await getAuthToken()
    if (!auth) {
      swal({
        title: 'Unauthorized Camera fail',
        type: 'error',
      })
    }
    /* get list of cameras */
    let cameraList = []
    cameraList = this.props.cameraList.map((cameraItem, index) => ({
      key: `${this.props.station.key}_${index}`,
      stationKey: this.props.station.key,
      stationName: this.props.station.name,
      stationType: this.props.station.stationType,
      src: `${cameraItem.rtspUrl}`,
      lastThumbnail: this.getLastThumbnail(
        cameraItem.rtspUrl,
        cameraItem.cameraId,
        auth
      ),
      name: cameraItem.name,
      _id: this.props.station._id,
    }))
    /* create list of cameras without unicode */
    const cameraListNotUnicode = cameraList.map(item => {
      const _item = _.clone(item)
      _item.name = removeUnicodeText(_item.name)
      _item.stationName = removeUnicodeText(_item.stationName)
      return _item
    })

    this.setState({
      cameraList,
      cameraListNotUnicode,
      auth: auth,
      isLoaded: true,
    })
  }

  getLastThumbnail = (url, cameraId, auth) => {
    const prefixArr = _.split(url, '//')
    const strDomain = _.split(prefixArr[1], '/')

    let lastThumbnail = ''
    if (strDomain.length > 0) {
      lastThumbnail = `${prefixArr[0]}//${strDomain[0]}/ec2/cameraThumbnail?auth=${auth}&cameraId={${cameraId}}&width=300&height=300`
    }
    return lastThumbnail
  }

  cbPlay = () => {
    this.setState(prevState => ({
      countStartCamera: prevState.countStartCamera + 1,
    }))
  }

  cbStop = () => {
    this.setState(prevState => ({
      countStartCamera: prevState.countStartCamera - 1,
    }))
  }

  render() {
    const { cameraList } = this.state
    return (
      <WrapperContainer>
        {this.state.isLoaded && cameraList.length > 0 ? (
          cameraList.map(camera => (
            <ListItem
              auth={this.state.auth}
              key={`${camera.key}`}
              camera={camera}
              onCameraClick={this.handleCamera}
              countStartCamera={this.state.countStartCamera}
              cbPlay={this.cbPlay}
              cbStop={this.cbStop}
            />
          ))
        ) : (
          <Empty
            style={{
              margin: '0 auto',
              padding: '8px 16px',
            }}
          />
        )}
      </WrapperContainer>
    )
  }
}
