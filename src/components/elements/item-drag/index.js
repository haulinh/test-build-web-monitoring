import { Checkbox, Col, Row as RowAnt } from 'antd'
import React from 'react'
import styled from 'styled-components'
import iconDragDrop from 'assets/svg-icons/IconDragDrop.svg'

const Row = styled(RowAnt)`
  width: 100%;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 6px 16px;

  .item {
    font-size: 16px;
  }
`

const ItemDrag = ({ name, itemKey, form, checked = true }) => {
  const onChangeCheckBox = e => {
    e.stopPropagation()

    const valueCheckBox = form.getFieldValue(`selectedList.${itemKey}`)

    form.setFieldsValue({
      [`selectedList.${itemKey}`]: !valueCheckBox,
    })
  }
  return (
    <Row type="flex" justify="space-between" align="middle">
      <Col style={{ flex: 1 }}>
        <Row type="flex" style={{ gap: '12px' }}>
          {form.getFieldDecorator(`selectedList.${itemKey}`, {
            valuePropName: 'checked',
            initialValue: checked,
          })(<Checkbox />)}
          <div className="item" onClick={onChangeCheckBox}>
            {name}
          </div>
        </Row>
      </Col>

      <Col style={{ width: '24px' }}>
        <img className="icon-drag" src={iconDragDrop} alt="icon Drag" />
      </Col>
    </Row>
  )
}

export default ItemDrag
