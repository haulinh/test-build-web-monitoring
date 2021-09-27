import { Drawer } from 'antd'
import styled from 'styled-components'

export const ILLDrawer = styled(Drawer)`
  .ant-drawer-body {
    height: calc(100vh - 55px);
  }
`
export const FixedBottom = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
`
