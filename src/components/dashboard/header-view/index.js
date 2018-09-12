import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Menu, Dropdown, Button, Icon, message } from 'antd';
import * as _ from 'lodash'

const WrapperView = styled.div` 
margin-bottom: 16px;
border-radius: 4px;
display: flex;
justify-content: space-between;
align-items: center;
background: linear-gradient(135deg,#1d89ce 0%,#56d2f3 100%);
padding: 8px 8px;
height: 50px background: #ccd `

@autobind
export default class HeaderView extends React.PureComponent {

  constructor (props) {
    super(props)
    const menus = _.get(this.props, 'menus', [])
    this.state = {
      menus,
      
      selected: 'ALL'
    }
  }

  handleMenuClick = (e) => {
    console.log('click', e);
  }

  handleButtonClick = (e) => {
   // message.info('Click on menu item.');
   // console.log('click', e);
  }

  menu = () => (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="ALL">-- All --</Menu.Item>
      <Menu.Item key="1"><Icon type="user" />1st menu item</Menu.Item>
    </Menu>
  )

  render() {
    return (
      <WrapperView>
        <Dropdown.Button
          overlay={this.menu()}
          style={{ marginLeft: 8 }}
        >
          Dropdown
        </Dropdown.Button>
         
      </WrapperView>
    )
  }
}
