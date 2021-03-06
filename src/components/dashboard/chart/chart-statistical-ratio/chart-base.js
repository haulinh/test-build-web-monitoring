import React from 'react'
import styled from 'styled-components'
// import { Icon } from 'antd'

const WrapperView = styled.div``
const HeaderView = styled.div`
  padding: 16px 0;
  background: #cdc;
  flex-direction: row;
  display: flex;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.85);
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  margin-bottom: -1px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8e8e8;
`
const TitleView = styled.div`
  font-size: 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: center;
`

export default class ChartBaseView extends React.Component {
  state = {
    isOpen: true,
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.isOpen !== this.state.isOpen
  // }

  toggle = e => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    return (
      <WrapperView style={{ flex: 1, ...this.props.style }}>
        <HeaderView onClick={this.toggle}>
          <TitleView>{this.props.title}</TitleView>
          {/* MARK  LAUNCHING V1: remove icon & default open true */}
          {/* <Icon
            type="down"
            theme="outlined"
            onClick={this.toggle}
            style={{
              transform: `rotate(${this.state.isOpen ? 0 : -90}deg)`
            }}
          /> */}
        </HeaderView>
        {this.props.children}
      </WrapperView>
    )
  }
}
