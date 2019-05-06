import React from 'react'
import propTypes from 'prop-types'
import {Drawer, Icon, Tabs} from 'antd'
import { prop } from 'cramda';

const i18n = {

}

export default class NotificationDrawer extends React.Component {
  static propTypes = {
    onClose: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired
  }
  static defaultProps = {}
  state = {}

  render() {
    return (
      <Drawer
        width='40vw'
        title={<React.Fragment>
          <Icon type="double-left" /> Notifications
        </React.Fragment>}
        placement="left"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
      </Drawer>
    )
  }
}


