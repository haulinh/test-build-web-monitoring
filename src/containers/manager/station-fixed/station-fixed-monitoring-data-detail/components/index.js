import { Drawer, Icon, Input } from 'antd'
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
  :hover {
    background-color: rgb(240, 240, 240);
  }
  min-height: ${props => props.type === 'textArea' && '250px'};
  max-height: 250px;
`

const InputCustom = styled(Input)`
  font-size: ${props => props.fontSize && `${props.fontSize}px`};
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
    const res = update()
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
                display: 'flex',
                height: '40px',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: '11px',
                paddingRight: '11px',
                minHeight: 30,
                maxHeight: 250,
                whiteSpace: 'pre-wrap',
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

    return (
      <div>
        <b>{title}</b>
        <InputCustom
          {...props}
          style={{ width: '100%', height: '40px' }}
          fontSize={style && style.fontSize}
        />
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
