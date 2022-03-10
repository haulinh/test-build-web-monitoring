import React, { Component } from 'react'
import { Drawer as DrawerAnt } from 'antd'
import styled from 'styled-components'
import { getPhase } from 'api/station-fixed/StationFixedPhaseApi'
import FormMonitoring from './form'

const Drawer = styled(DrawerAnt)`
  .ant-drawer-body {
    height: calc(100% - 55px);
    flex-direction: column;
    padding: 0;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 0;
  }
`
export default class DrawerMonitoring extends Component {
  state = {
    phases: [],
  }

  fetchPhase = async () => {
    const response = await getPhase()
    this.setState({
      phases: response,
    })
  }

  componentDidMount = () => {
    this.fetchPhase()
  }
  render() {
    const { visible, onClose } = this.props
    const { phases } = this.state

    return (
      <Drawer
        title="Nhập liệu điểm quan trắc"
        visible={visible}
        closable={false}
        placement="right"
        onClose={onClose}
        width={600}
      >
        <FormMonitoring phases={phases} />
      </Drawer>
    )
  }
}
