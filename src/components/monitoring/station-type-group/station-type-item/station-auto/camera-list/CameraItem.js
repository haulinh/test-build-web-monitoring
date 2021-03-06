import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'reactstrap'
// import { getConfigApi } from 'config'

const CameraItemWrapper = styled.div``

const RATIO_CAMERA = 0.44

@autobind
export default class CameraItem extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    rtspUrl: PropTypes.string,
    index: PropTypes.number,
    auth: PropTypes.string.isRequired,
  }

  state = {
    width: 0,
    height: 0,
  }

  componentDidMount() {
    const offsetWidth = this.cameraRef.offsetWidth - 2
    this.setState({
      width: offsetWidth,
      height: offsetWidth * RATIO_CAMERA,
    })
  }

  getIframeProps() {
    return {
      width: this.state.width + 'px',
      height: this.state.height + 'px',
    }
  }

  render() {
    return (
      <CameraItemWrapper innerRef={ref => (this.cameraRef = ref)}>
        <Card>
          <CardHeader>
            <strong>{this.props.name}</strong>
          </CardHeader>
          {this.state.width ? (
            <video
              style={{ width: this.state.width }}
              controls
              src={`${this.props.rtspUrl}&auth=${this.props.auth}`}
            />
          ) : null}
        </Card>
      </CameraItemWrapper>
    )
  }
}
