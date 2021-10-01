import { Drawer, Icon, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Clearfix, Flex } from 'components/layouts/styles'
import React from 'react'
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

const DivHover = styled.div`
  height: ${props => (props.type === 'textArea' ? '200px' : '40px')};
  padding: 4px 0px;
  :hover {
    background-color: rgb(240, 240, 240);
  }
`
export class EditWrapper extends React.Component {
  state = {
    isClicked: false,
  }

  toggleEdit = () => {
    this.setState(prevState => ({ isClicked: !prevState.isClicked }))
  }

  handleOnOk = () => {
    this.toggleEdit()
  }

  handleCancel = () => {
    const { onChange, prevValue } = this.props
    this.toggleEdit()
    onChange(prevValue)
  }

  render() {
    const { isClicked } = this.state
    const { type, value, onChange, style, title } = this.props
    if (!isClicked)
      return (
        <React.Fragment>
          <b>{title}</b>
          <DivHover type={type} onClick={this.toggleEdit}>
            <span style={style}>{value}</span>
          </DivHover>
        </React.Fragment>
      )
    const styleIcon = {
      fontSize: 18,
      background: '#E6F7FF',
      borderRadius: 4,
      padding: 4,
      color: '#008EFA',
    }

    const props = {
      value,
      onChange,
    }

    const Component = {
      input: <Input {...props} />,
      textArea: <TextArea {...props} />,
    }

    return (
      <div>
        <b>{title}</b>
        {Component[type]}
        <Clearfix height={12} />
        <Flex justifyContent="end">
          <Icon
            type="check"
            theme="outlined"
            style={styleIcon}
            onClick={this.handleOnOk}
          />
          <Clearfix width={12} />
          <Icon
            onClick={this.handleCancel}
            type="close"
            theme="outlined"
            style={styleIcon}
          />
        </Flex>
      </div>
    )
  }
}
