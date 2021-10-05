import { Drawer, Icon } from 'antd'
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
    console.log({ result })
    if (!result) return

    this.toggleEdit()
  }

  handleCancel = () => {
    const { name, prevValue, revertValue } = this.props
    this.toggleEdit()
    revertValue({ [name]: prevValue })
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
