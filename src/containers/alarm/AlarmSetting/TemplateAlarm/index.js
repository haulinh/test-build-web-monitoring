import { getAlarmConfig } from 'api/CategoryApi'
import React, { Component } from 'react'

export default class TemplateAlarm extends Component {
  async componentDidMount() {
    const res = await getAlarmConfig()
    console.log({ res })
  }

  render() {
    return <div>TemplateAlarm</div>
  }
}
