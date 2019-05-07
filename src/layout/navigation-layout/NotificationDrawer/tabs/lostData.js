import React from 'react'
import propTypes from 'prop-types'
import {} from 'antd'
import { translate } from 'hoc/create-lang'

const i18n = {
}

export default class NotificationDrawer extends React.Component {
  static propTypes = {
    loadNotifications: propTypes.func.isRequired,
    tabKey: propTypes.string.isRequired
  }
  static defaultProps = {
  }
  state = {}

  componentWillMount() {
    this.props.loadNotifications(1)
  }

  render() {
    return (
      <div>Lost data</div>
    )
  }
}


