import { Button, Dropdown, Menu, Row } from 'antd'
import iconUploadFile from 'assets/svg-icons/UploadFile.svg'
import iconUploadManual from 'assets/svg-icons/UploadIcon.svg'
import React, { Component } from 'react'
import styled from 'styled-components'

const FixedButton = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;

  .ant-dropdown-menu {
    width: 211px;
  }
`

export default class DropdownButton extends Component {
  render() {
    const { onClickImportFile, onClickImportManual } = this.props

    return (
      <FixedButton>
        <Dropdown
          styled={{ width: '250px' }}
          getPopupContainer={trigger => trigger.parentNode}
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={onClickImportManual}>
                <Row type="flex" align="middle">
                  <img src={iconUploadManual} alt="" />
                  <div style={{ marginLeft: '10px' }}>Nhập nhanh dữ liệu</div>
                </Row>
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={onClickImportFile}
                styled={{ gap: '5px' }}
              >
                <Row type="flex" align="middle">
                  <img src={iconUploadFile} alt="" />
                  <div style={{ marginLeft: '10px' }}>Tải lên theo mẫu</div>
                </Row>
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
