import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { getAuthTokenCamera } from 'api/StationAuto'
import { Spin } from 'antd'
import swal from 'sweetalert2'
import CameraList from 'components/camera-video'

const Wrapper = styled.div`
  margin-top: 8px;
  .ant-collapse {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .ant-collapse-item {
    width: 50%;
  }
  .ant-collapse-header {
    text-align: center;
  }
`

@autobind
export default class CameraForm extends PureComponent {
  static propTypes = {
    station: PropTypes.object,
    cameraList: PropTypes.array,
  }
  state = {
    isLoaded: false,
  }

  async componentDidMount() {
    //todo
    const auth = await getAuthTokenCamera()
    if (!auth) {
      swal({
        title: 'Unauthorized Camera fail',
        type: 'error',
      })
    }
    this.setState({ auth: auth.token, isLoaded: true })
  }

  render() {
    return (
      <Wrapper>
        <Spin size="large" spinning={!this.state.isLoaded}>
          <CameraList
            station={this.props.station}
            cameraList={this.props.cameraList}
          />
        </Spin>
      </Wrapper>
    )
  }
}
