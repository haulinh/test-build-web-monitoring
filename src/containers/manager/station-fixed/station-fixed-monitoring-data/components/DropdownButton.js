import React, { Component } from 'react'
import { Menu, Dropdown, Button, Icon } from 'antd'
import styled from 'styled-components'

const FixedButton = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;
`

export default class DropdownButton extends Component {
  render() {
    const { onClickImportFile, onClickImportManual } = this.props

    return (
      <FixedButton>
        <Dropdown
          getPopupContainer={trigger => trigger.parentNode}
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={onClickImportManual}>
                <Icon type="upload" /> Nhập nhanh dữ liệu
              </Menu.Item>
              <Menu.Item key="2" onClick={onClickImportFile}>
                <Icon type="file-add" /> Tải lên theo mẫu
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="primary" shape="circle" icon="plus" size="large" />
        </Dropdown>
      </FixedButton>
    )
  }
}
