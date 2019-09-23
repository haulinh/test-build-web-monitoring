import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Result, Button } from 'antd'
import { translate } from 'hoc/create-lang'

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
        icon={ <img alt='' src="/images/warning/disconnection.jpg" /> }
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
