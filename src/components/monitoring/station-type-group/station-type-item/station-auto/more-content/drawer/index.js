import React from 'react'
import { Drawer } from 'antd'
import PropTypes from 'prop-types'
import StationInfo from './info'
import StationImage from './image'
import StationComment from './comment'
export default class DrawerInfoStation extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    visibleDrawer: PropTypes.bool,
    type: PropTypes.string,
    _id: PropTypes.string,
  }

  render() {
    const { onClose, visibleDrawer, type } = this.props
    return (
      <Drawer
        width={720}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleDrawer}
      >
        {type === 'info' && <StationInfo stationID={this.props._id} />}
        {type === 'image' && <StationImage stationID={this.props._id} />}
        {type === 'comment' && <StationComment stationId={this.props._id} />}
      </Drawer>
    )
  }
}
