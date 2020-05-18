import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import WarningLevel from 'components/elements/warning-level'
import WarningLevelDevices from 'components/elements/warning-level-device'

// import { COLOR_DEVICE_STATUS } from 'themes/color'
// import BookIcon from '@atlaskit/icon/glyph/book'

// align-items: center;
// justify-content: space-between;
const HeaderWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  margin-left: 8px;
`
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  flex: 1;
`

@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  }

  state = {
    isVisible: false
  }

  hideInfoWarningLevels = () => {
    this.setState({ isVisible: true })
  }
  render() {
    return (
      <HeaderWrapper>
        {this.props.children}
        <WarningWrapper>
          <WarningLevelDevices />
          <WarningLevel style={{ marginTop: 4 }} />
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
