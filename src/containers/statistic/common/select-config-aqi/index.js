import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Select } from 'antd'
import { getListConfigAqi } from 'api/CategoryApi'

import * as _ from 'lodash'

@autobind
export default class SelectConfigAQI extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    provinceKey: PropTypes.string,
  }

  state = {
    isLoaded: false,
    stationConfigSelects: [],
  }

  componentDidMount = async () => {
    getListConfigAqi()
      .then(retult => {
        const data = _.get(retult, 'data.value', [])
        // console.log(data, '--data')
        this.setState({
          dataSource: _.filter(data, item => {
            return item.activated
          }),
          isLoaded: true,
        })
      })
      .catch(ex => {
        this.setState({
          dataSource: [],
          isLoaded: true,
        })
        console.log(ex, '--ex--')
      })
  }

  render() {
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        {...this.props}
        // onChange={this.handleChange}
        showSearch
      >
        {this.state.dataSource.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
