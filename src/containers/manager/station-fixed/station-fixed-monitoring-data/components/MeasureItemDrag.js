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

  .icon-drag {
    cursor: pointer;
  }
`

const MeasureItemDrag = ({ name, measureKey, form }) => {
  return (
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Row type="flex" style={{ gap: '12px' }}>
          {form.getFieldDecorator(`selectedList.${measureKey}`, {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox />)}
          <div className="measure">{name}</div>
        </Row>
      </Col>

      <Col>
        <img className="icon-drag" src={iconDragDrop} alt="icon Drag" />
      </Col>
    </Row>
  )
}

export default MeasureItemDrag
