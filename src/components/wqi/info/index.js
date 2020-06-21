import React from 'react'
import WQIList from './wqi-list'

import connectWindowHeight from 'hoc/window-height'

@connectWindowHeight
export default class InfoComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
        }}
      >
        <WQIList
          onSelect={this.props.onSelect}
          wqiLevel={this.props.wqiLevel}
          wqiList={this.props.wqiList}
        />
      </div>
    )
  }
}
