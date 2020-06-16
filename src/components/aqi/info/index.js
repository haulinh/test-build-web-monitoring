import React from 'react'
import AQIList from './aqi-list'

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
          height: this.props.windowHeight,
          padding: 16,
          overflow: 'scroll',
        }}
      >
        <AQIList
          locale={this.props.locale}
          onChangeLocale={this.props.onChangeLocale}
          onSelect={this.props.onSelect}
          aqiLevel={this.props.aqiLevel}
          aqiList={this.props.aqiList}
        />
      </div>
    )
  }
}
