import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import styled from 'styled-components'
import EditIcon from 'assets/svg-icons/EditIcon.svg'
import TrashIcon from 'assets/svg-icons/TrashIcon.svg'
import ButtonMoreAction from 'assets/svg-icons/ButtonMoreAction.svg'

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const DropdownMoreAction = ({ onEdit, onDelete, isEdit, isDelete }) => {
  return (
    <Dropdown
      placement="bottomCenter"
      overlay={
        <Menu>
          {isEdit && (
            <Menu.Item key="1" onClick={onEdit}>
              <Flex>
                <img src={EditIcon} alt="icon edit" />
                Chỉnh sửa
              </Flex>
            </Menu.Item>
          )}
          {isDelete && (
            <Menu.Item key="2" onClick={onDelete}>
              <Flex>
                <img src={TrashIcon} alt="icon trash" />

                <div style={{ color: '#E64D3D' }}>Xóa</div>
              </Flex>
            </Menu.Item>
          )}
        </Menu>
      }
      trigger={['click']}
    >
      <Button type="link" onClick={e => e.preventDefault()}>
        <img src={ButtonMoreAction} alt="icon more action" />
      </Button>
    </Dropdown>
  )
}
