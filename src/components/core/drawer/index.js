import { Col, Drawer, Row, Divider } from 'antd'
import React from 'react'
import styled from 'styled-components'

const DrawerStyled = styled(Drawer)`
  .ant-drawer-body {
    padding-left: 0;
    padding-right: 0;
  }
  .ant-drawer-body {
    height: calc(100vh - 55px);
  }
`

const CDrawer = ({ title, right, ...props }) => {
  return (
    <DrawerStyled {...props}>
      <Row
        type="flex"
        justify="space-between"
        style={{
          paddingRight: 24,
          paddingLeft: 24,
          borderBottomWidth: 1,
          marginBottom: 24,
        }}
      >
        <Col span={20}>
          <b
            style={{
              fontWeight: '500',
              fontSize: '16px',
              color: 'rgb(0, 0, 0, 0.85)',
            }}
          >
            {title}
          </b>
        </Col>
        <Col span={1}>{right}</Col>
      </Row>

      <div style={{ height: 16, background: '#F8F8FB' }} />

      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          background: '#F8F8FB',
        }}
      >
        {props.children}
      </div>
    </DrawerStyled>
  )
}

export default CDrawer
