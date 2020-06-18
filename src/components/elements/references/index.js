import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from 'antd'
import { translate } from 'hoc/create-lang'
import { withRouter } from 'react-router'

const Wrapper = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Strong = styled.strong`
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 36px;
`

@withRouter
export default class References extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  }

  goto = () => {
    if (this.props.pathGoto) this.props.history.push(this.props.pathGoto)
  }

  render() {
    return (
      <Wrapper>
        <img
          style={{ minHeight: 305 }}
          alt="References"
          src="/images/references.png"
        />
        <Strong>{this.props.title}</Strong>
        <Button
          onClick={this.goto.bind(this)}
          type="primary"
          style={{ width: 320, height: 40 }}
        >
          {translate('wqi.move')}
        </Button>
      </Wrapper>
    )
  }
}
