import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from '../../../api/ProvinceApi'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { get, keyBy } from 'lodash'
import LanguageContent from 'components/language/language-content'

const SelectWrapper = styled.div`
  width: 100%;
  .ant-select {
    width: 100%;
  }
`

@autobind
export default class ProvinceSelect extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    provinceList: [],
    data: {},
  }

  handerOnChange = value => {
    this.props.onChange(get(this.state.data, value, null))
  }

  async componentDidMount() {
    let query = {}
    const rs = await ProvinceApi.getProvinces({}, query)
    const provinceList = get(rs, 'data', [])
    const data = keyBy(provinceList, 'key')
    this.setState({ provinceList, data })
  }

  render() {
    return (
      <SelectWrapper>
        <Select
          showSearch
          {...this.props}
          onChange={this.handerOnChange}
          defaultValue=""
        >
          <Select.Option value={''}>{translate('chart.all')}</Select.Option>
          {this.state.provinceList.map(({ _id: itemId, key, name }) => (
            <Select.Option key={key} value={key}>
              <LanguageContent type="Province" value={name} itemId={itemId} />
            </Select.Option>
          ))}
        </Select>
      </SelectWrapper>
    )
  }
}
