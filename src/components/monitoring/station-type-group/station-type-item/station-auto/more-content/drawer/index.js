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
    const { onClose, visibleDrawer, type, _id, name } = this.props
    return (
      <Drawer
        width={720}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleDrawer}
      >
        {type === 'info' && <StationInfo stationID={_id} />}
        {type === 'image' && (
          <StationImage stationID={_id} stationName={name} />
        )}
        {type === 'comment' && (
          <StationComment stationId={_id} stationName={name} />
        )}
      </Drawer>
    )
  }
}
