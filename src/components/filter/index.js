import React, { Component } from 'react'
import { Affix, Col as ColAnt, Menu, Input } from 'antd'
import styled from 'styled-components'

const { SubMenu } = Menu

const MENU_WIDTH = 300

const Col = styled(ColAnt)`
  width: ${MENU_WIDTH}px;
  min-height: calc(100vh - 57px);

  .ant-menu {
    min-height: calc(100vh - 57px);
  }
`

export default class FilterList extends Component {
  render() {
    return (
      <Affix>
        <Col>
          <Input />
          <Menu mode="inline">
            <SubMenu key="sub1" title="Tất cả">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 1</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="Tất cả">
              <Menu.Item key="1">Option 2</Menu.Item>
              <Menu.Item key="2">Option 3</Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
      </Affix>
    )
  }
}
