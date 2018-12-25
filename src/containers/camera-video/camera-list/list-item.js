import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import Player from '../player-view'
import { Link } from 'react-router-dom'
import slug from 'constants/slug'
import * as _ from 'lodash'
const { Meta } = Card

const DescriptionView = styled.div``

export default class ListItemView extends React.PureComponent {

  handleCamera = e => {
    if (this.props.onCameraClick) {
      this.props.onCameraClick(this.props.camera)
    } 
  }

  render() {

    const { src, stationName, name, _id, stationType: {key}} = this.props.camera

    return (
      <Card
        style={{ width: 250, marginRight: 12, marginBottom: 12 }}
        cover={<Player src={src} />}
      >
        <Link
          onClick={this.handleCamera}
          to={`${slug.cameraControl.detailWithKey}/${key}/${_id}?name=${encodeURIComponent(_.deburr(name))}`}
        >
          <Meta
            title={name}
            description={<DescriptionView>{stationName}</DescriptionView>}
          />
        </Link>
      </Card>
    );
  }
}
