import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from '../../../api/ProvinceApi'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { get, keyBy } from 'lodash'
import {getContent} from 'components/language/language-content'
import {connect} from 'react-redux'

const SelectWrapper = styled.div`
  width: 100%;
  .ant-select {
    width: 100%;
  }
  .ant-select-selection--single {
    width: 100%;
    background-color: #41aee4;
    border: 0px;
  }
  .ant-select-selection-selected-value {
    color: #ffffff;
    padding-right: 15px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .ant-select-arrow {
    color: #ffffff;
  }
`

@autobind
@connect(state => ({languageContents: state.language.languageContents}))
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
    const {languageContents} = this.props
    return (
      <SelectWrapper>
        <Select
          showSearch
          {...this.props}
          onChange={this.handerOnChange}
          defaultValue=""
        >
          <Select.Option value={''}>
            {translate('dashboard.selectProvince')}
          </Select.Option>
          {this.state.provinceList.map(({ _id, key, name }) => (
            <Select.Option key={key} value={key}>
            {getContent(languageContents, {type: 'Province', itemId: _id, field:'name', value: name})}
            </Select.Option>
          ))}
        </Select>
      </SelectWrapper>
    )
  }
}
