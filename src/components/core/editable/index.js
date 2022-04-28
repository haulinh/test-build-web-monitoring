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

  componentDidMount() {
    window.addEventListener('click', this.handleOnClickOutSide)
  }

  handleOnClickOutSide = e => {
    if (
      this.state.isEditing &&
      this.ref.current &&
      !this.ref.current.contains(e.target)
    ) {
      this.setState({ isEditing: false })
    }
  }

  toggleEdit = () => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }))
  }

  handleOnOk = async () => {
    console.log('fuck click')
    const { onOk } = this.props
    await onOk()
    this.toggleEdit()
  }

  handleOnCancel = async () => {
    const { onCancel } = this.props
    onCancel()
    this.toggleEdit()
  }

  render() {
    const { text, type, placeholder, children, onOk, ...props } = this.props
    const { isEditing } = this.state

    return (
      <div ref={this.ref} {...props}>
        {isEditing ? (
          <div>
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
          <div onClick={() => this.setState({ isEditing: true })}>
            {text || placeholder || 'Editable content'}
          </div>
        )}
      </div>
    )
  }
}
