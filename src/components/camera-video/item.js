import React from 'react'
import styled from 'styled-components'
import { Card } from 'antd'
import Player from 'components/elements/video-player'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'
import * as _ from 'lodash'
import PropTypes from 'prop-types'

const { Meta } = Card

const DescriptionView = styled.div``

export default class ListItemView extends React.Component {
  static propTypes = {
    auth: PropTypes.string.isRequired,
    countStartCamera: PropTypes.number.isRequired,
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
      _id,
      stationType: { key },
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
          />
        }
      >
        <Link
          onClick={this.handleCamera}
          to={`${
            slug.cameraControl.detailWithKey
          }/${key}/${_id}?name=${encodeURIComponent(_.deburr(name))}`}
        >
          <Meta
            title={name}
            description={<DescriptionView>{stationName}</DescriptionView>}
          />
        </Link>
      </Card>
    )
  }
}
