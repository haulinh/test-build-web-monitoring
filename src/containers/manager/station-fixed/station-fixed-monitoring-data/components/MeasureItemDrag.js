import { Checkbox, Col, Row as RowAnt } from 'antd'
import React from 'react'
import styled from 'styled-components'
import iconDragDrop from 'assets/svg-icons/IconDragDrop.svg'

const Row = styled(RowAnt)`
  width: 100%;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 6px 16px;

  .measure {
    font-size: 16px;
  }

  /* .icon-drag {
    cursor: pointer;
  } */
`

const MeasureItemDrag = ({ name, measureKey, form }) => {
  const onChangeCheckBox = () => {
    const valueCheckBox = form.getFieldValue(`selectedList.${measureKey}`)

    form.setFieldsValue({
      [`selectedList.${measureKey}`]: !valueCheckBox,
    })
  }
  return (
    <Row type="flex" justify="space-between" align="middle">
      <Col style={{ flex: 1 }} onClick={onChangeCheckBox}>
        <Row type="flex" style={{ gap: '12px' }}>
          {form.getFieldDecorator(`selectedList.${measureKey}`, {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox />)}
          <div className="measure">{name}</div>
        </Row>
      </Col>

      <Col style={{ width: '24px' }}>
        <img className="icon-drag" src={iconDragDrop} alt="icon Drag" />
      </Col>
    </Row>
  )
}

export default MeasureItemDrag
