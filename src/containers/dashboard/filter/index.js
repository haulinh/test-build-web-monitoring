import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import styled from 'styled-components'

import ProvinceApi from 'api/ProvinceApi'
import { translate as t } from 'hoc/create-lang'
import {getContent} from 'components/language/language-content'
import {connect} from 'react-redux'

const SelectWrapper = styled.div`
  width: 160px;
  .ant-select {
    width: 100%;
  }
`
function i18n() {
  return {
    placeholder: t('dashboard.managementArea'),
    all: t('global.all'),
  }
}

@connect(state => ({
  languageContents: state.language.languageContents
}))
class ProvinceSelect extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    provinces: [],
  }

  onChange = value => {
    const { onChange } = this.props
    onChange({ provinceKey: value })
  }

  async componentDidMount() {
    try {
      const result = await ProvinceApi.getProvinces({})
      const provinces = result.data || []
      this.setState({ provinces })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { provinces } = this.state
    const {languageContents} = this.props

    return (
      <SelectWrapper>
        <Select placeholder={i18n().placeholder} onChange={this.onChange}>
          <Select.Option value={null}>{i18n().all}</Select.Option>
          {provinces.map(item => (
            <Select.Option key={item._id} value={item.key}>
              {getContent(languageContents, {type: 'Province', itemId: item._id, value: item.name, field: 'name'})}
            </Select.Option>
          ))}
        </Select>
      </SelectWrapper>
    )
  }
}

export default ProvinceSelect
