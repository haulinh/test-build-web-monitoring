import { Button } from 'antd'
import { Flex } from 'components/layouts/styles'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Flex justifyContent="center">
          <div style={{ marginTop: 16 }}>
            <h2>Something went wrong.</h2>
            <Button onClick={() => (window.location.href = '/')} type="primary">
              Go Home Page
            </Button>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
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
