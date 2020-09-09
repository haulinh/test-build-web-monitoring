import React from 'react'
import styled from 'styled-components'
import { Card } from 'antd'
import Player from '/components/elements/video-player'
import PropTypes from 'prop-types'
import { STATUS_CAMERA } from 'constants/stationStatus'
import { translate } from 'hoc/create-lang'

const i18n = {
  errorAuth: translate('empty.camera.errorAuth'),
}

const { Meta } = Card

const DescriptionView = styled.div``

export default class ListItemView extends React.Component {
  static propTypes = {
    auth: PropTypes.string.isRequired,
    countStartCamera: PropTypes.number.isRequired,
    camera: PropTypes.object,
    cbPlay: PropTypes.func.isRequired,
    cbStop: PropTypes.func.isRequired,
  }

  handleCamera = e => {
    if (this.props.onCameraClick) {
      this.props.onCameraClick(this.props.camera)
    }
  }

  render() {
    const {
      src,
      stationName,
      name,
      status,
      // stationType: { key },
    } = this.props.camera

    return (
      <Card
        style={{ width: 320, marginRight: 12, marginBottom: 12 }}
        cover={
          <Player
            src={
              src.includes('?')
                ? `${src}&auth=${this.props.auth}`
                : `${src}?resolution=360p&sfd&rt&auth=${this.props.auth}`
            }
            auth={this.props.auth}
            cbPlay={this.props.cbPlay}
            cbStop={this.props.cbStop}
            countStartCamera={this.props.countStartCamera}
            status={status}
          />
        }
      >
        <Meta
          title={`${name}${
            status === STATUS_CAMERA.NOT_EXISTS ? ` - ${i18n.errorAuth}` : ''
          }`}
          description={<DescriptionView>{stationName}</DescriptionView>}
        />
      </Card>
    )
  }
}
