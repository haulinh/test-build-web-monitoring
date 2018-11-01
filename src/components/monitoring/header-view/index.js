import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import ProvinceSelect from './ProvinceSelect'

// background: linear-gradient(135deg,#1d89ce 0%,#56d2f3 100%);
const WrapperView = styled.div`
  border-radius: 4px;
  flex-direction: column;
  min-width: 250px;
`

const Label = styled.label`
  font-weight: bold;
  align-self: center;
`

@autobind
export default class HeaderView extends React.PureComponent {
  static propTypes = {
    stationStatus: PropTypes.string,
    onChange: PropTypes.func
  }

  handleItemSelected = value => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    return (
      <WrapperView>
        <ProvinceSelect label="All" onChange={this.handleItemSelected} />
        <Label style={{ paddingTop: 8 }}>{this.props.stationStatus}</Label>
      </WrapperView>
    )
  }
}
