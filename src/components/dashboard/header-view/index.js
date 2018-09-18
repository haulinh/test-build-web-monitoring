import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import ProvinceSelect from './ProvinceSelect'

const WrapperView = styled.div` 
margin-bottom: 16px;
border-radius: 4px;
display: flex;
background: linear-gradient(135deg,#1d89ce 0%,#56d2f3 100%);
padding: 8px 8px;
height: 50px background: #ccd `

const Label = styled.label`
  flex: 1;
  font-weight: bold;
  color: #fff !important;
  align-self: center;
  padding-left: 16px;
`

const View = styled.div`
  flex: ${props => props.flex}
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
        <View flex={1} style={{ minWidth: 250 }}>
          <ProvinceSelect label="Tat ca" onChange={this.handleItemSelected} />
        </View>
        <View flex={2}>
          <Label style={{ paddingTop: 8 }}>{this.props.stationStatus}</Label>
        </View>
      </WrapperView>
    )
  }
}
