import { DatePicker, Drawer, Icon, Input, InputNumber } from 'antd'
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
  padding: 4px 0px;
  :hover {
    background-color: rgb(240, 240, 240);
  }
  min-height: ${props => props.type === 'textArea' && '400px'};
`

const InputCustom = styled(Input)`
  font-size: ${props => props.fontSize && `${props.fontSize}px`};
`
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
    const {
      type,
      value,
      onChange,
      style,
      title,
      height,
      maxLength,
    } = this.props
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: '11px',
                paddingRight: '11px',
                minHeight: 30,
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
      input: (
        <InputCustom
          {...props}
          style={{ width: '100%', height }}
          fontSize={style.fontSize}
          maxLength={maxLength}
        />
      ),
      textArea: (
        <TextArea
          {...props}
          style={{ width: '100%', height: 400 }}
          maxLength={520}
        />
      ),
      number: <InputNumber {...props} style={{ width: '100%', height }} />,
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

export class ControlledDatePicker extends React.Component {
  state = { mode: 'time', value: null }

  handleOpenChange = open => {
    if (open) {
      this.setState({ mode: 'time' })
    }
  }

  handlePanelChange = (value, mode) => {
    this.setState({ mode })
  }

  handleOnOk = () => {
    const { update, fieldName } = this.props
    update(fieldName)
  }

  render() {
    return (
      <DatePicker
        {...this.props}
        mode={this.state.mode}
        showTime
        onOk={this.handleOnOk}
        onOpenChange={this.handleOpenChange}
        onPanelChange={this.handlePanelChange}
      />
    )
  }
}
