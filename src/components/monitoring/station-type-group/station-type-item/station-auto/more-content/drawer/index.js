import React from 'react'
import { Drawer } from 'antd'
import PropTypes from 'prop-types'
import StationInfo from './info'
import StationImage from './image'

export default class DrawerInfoStation extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    visibleDrawer: PropTypes.bool,
    type: PropTypes.string,
    _id: PropTypes.string
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
        {type === 'info' && <StationInfo {...this.props} />}
        {type === 'image' && <StationImage stationID={this.props._id} />}
      </Drawer>
    )
  }
}
