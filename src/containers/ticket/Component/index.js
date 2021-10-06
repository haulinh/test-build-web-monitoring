import { Drawer, Icon, Input, InputNumber } from 'antd'
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

  handleOnOk = async () => {
    const { update } = this.props

    const result = await update()
    if (!result) return

    this.toggleEdit()
  }

  handleCancel = () => {
    const { prevValue, revertValue, name } = this.props
    revertValue({ [name]: prevValue })
    this.toggleEdit()
  }

  render() {
    const { isClicked } = this.state
    const { type, value, style, title, children } = this.props
    if (!isClicked)
      return (
        <React.Fragment>
          <b>{title}</b>
          <DivHover type={type} onClick={this.toggleEdit}>
            <span style={style || { fontSize: 14, color: '#262626' }}>
              {value}
            </span>
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

    return (
      <div>
        <b>{title}</b>
        {children}
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

export class EditWrapper2 extends React.Component {
  state = {
    isClicked: false,
  }

  toggleEdit = () => {
    this.setState(prevState => ({ isClicked: !prevState.isClicked }))
  }

  handleOnOk = async () => {
    const { update } = this.props
    const res = await update()
    if (!res) return
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
            <div
              style={{
                maxWidth: '100%',
                fontSize: 14,
                wordBreak: 'break-all',
                ...style,
              }}
            >
              {value}
            </div>
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
      style: {
        width: '100%',
      },
    }

    const Component = {
      input: <Input {...props} />,
      textArea: <TextArea {...props} maxLength={520} />,
      number: <InputNumber {...props} />,
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
