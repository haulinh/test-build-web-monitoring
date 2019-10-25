import React from 'react'
import PropTypes from 'prop-types'
import { Result, Button } from 'antd'
import { translate } from 'hoc/create-lang'
import DisconnectionImage from './disconnection.jpg'

const i18n = {
  tryAgain: translate("actions.tryAgain")
}

export default class Disconnection extends React.Component {
  static propTypes = {
    messages: PropTypes.string.isRequired,
    onClickTryAgain: PropTypes.func,
    isLoading: PropTypes.bool.isRequired
  }
  
  render() {
    const {messages, onClickTryAgain, isLoading} = this.props
    return (
      <Result
        icon={ <img alt='' src={DisconnectionImage} width={200} /> }
        title={messages}
        extra={
          onClickTryAgain && (
            <Button type="primary" key="console" onClick={onClickTryAgain} loading={isLoading}>
              {i18n.tryAgain}
            </Button>
          )
        }
      />  
    )
  }
}
