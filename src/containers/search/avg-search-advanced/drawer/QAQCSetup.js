import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Drawer } from 'antd'
import translate from 'hoc/create-lang'
import QAQCConfig from 'containers/qa-qc/config'

const Wrapper = styled.div`
  .ant-form {
    padding: 0 !important;
  }
`

export default class QAQCSetup extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  handleOpen = () => {
    this.setState({ visible: true })
  }

  handleClose = () => {
    this.setState({ visible: false })
  }

  handleCompleted = () => {
    this.handleClose()
  }

  render() {
    return (
      <Drawer
        title={translate('qaqcConfig.title')}
        placement="right"
        closable
        width={650}
        onClose={this.handleClose}
        visible={this.state.visible}
      >
        <Wrapper>
          <QAQCConfig isDrawer onCompleted={this.handleCompleted} />
        </Wrapper>
      </Drawer>
    )
  }
}
