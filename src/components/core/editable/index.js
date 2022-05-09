import { Icon } from 'antd'
import { Clearfix, Flex } from 'components/layouts/styles'
import React from 'react'

const styleIcon = {
  fontSize: 18,
  background: '#c8e3f0',
  borderRadius: 4,
  padding: 4,
  color: '#008EFA',
  cursor: 'pointer',
}

export default class Editable extends React.Component {
  state = {
    isEditing: false,
  }

  ref = React.createRef()
  refInput = React.createRef()

  toggleEdit = () => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }))
  }

  handleOnOk = async () => {
    const { onOk } = this.props
    this.toggleEdit()
    await onOk()
  }

  handleOnCancel = async () => {
    const { onCancel } = this.props
    onCancel()
    this.toggleEdit()
  }

  // Event handler while pressing any key while editing
  handleKeyDown = (event, type) => {
    // const { key } = event
    // if (key === 'Enter') {
    //   event.target.blur()
    //   this.handleOnOk()
    //   return
    // }
  }

  render() {
    const { text, type, placeholder, children, onOk, ...props } = this.props
    const { isEditing } = this.state

    return (
      <div ref={this.ref} {...props}>
        {isEditing ? (
          <div onKeyDown={e => this.handleKeyDown(e)}>
            <React.Fragment>
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
                  onClick={this.handleOnCancel}
                  type="close"
                  theme="outlined"
                  style={styleIcon}
                />
              </Flex>
            </React.Fragment>
          </div>
        ) : (
          <div onClick={this.toggleEdit}>
            {React.cloneElement(text, {
              onClick: this.toggleEdit,
            }) ||
              placeholder ||
              'Editable content'}
          </div>
        )}
      </div>
    )
  }
}
