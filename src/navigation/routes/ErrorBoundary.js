import { Button } from 'antd'
import { Clearfix, Flex } from 'components/layouts/styles'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

const Error = () => {
  return (
    <div
      style={{
        borderRadius: '24px',
        display: 'flex',
        background: '#fff',
        boxShadow: '0px 12px 32px -12px rgba(0, 0, 0, 0.25)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60vw',
        height: '60vh',
      }}
    >
      <div
        style={{
          fontSize: '38px',
          fontWeight: '700',
          color: '#262626',
        }}
      >
        Something went wrong.
      </div>

      <div
        style={{
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: '16px',
          color: '#545454',
          marginTop: '24px',
        }}
      >
        We are sorry for the inconvenience.
      </div>

      <div style={{ marginTop: '48px' }}>
        <img
          src="/images/PageNotFound.svg"
          alt="not-found"
          style={{ width: 570, height: 164 }}
        />
      </div>

      <Clearfix height={48}/>
      <Button
        onClick={() => (window.location.href = '/')}
        size="large"
        type="primary"
      >
        Back Home
      </Button>
    </div>
  )
}

export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)

    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch (error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
      numberClick: 0
    })
    // You can also log error messages to an error reporting service here
  }

  handleClickHideView = () => {
    this.setState(prevState => ({ numberClick: prevState.numberClick + 1 }))
  }

  render () {
    const { numberClick } = this.state
    const isShowDetailError = numberClick > 5

    if (this.state.errorInfo) {
      // Error path
      return (
        <Flex justifyContent="center">
          <div style={{ marginTop: 48 }}>
            <Error/>
            <div style={{ height: 100, width: '100%' }} onClick={this.handleClickHideView}/>
            {isShowDetailError &&
              (<details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br/>
                {this.state.errorInfo.componentStack}
              </details>)
            }
          </div>
        </Flex>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
}
