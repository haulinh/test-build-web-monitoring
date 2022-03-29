import { Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import { default as React } from 'react'
import { FIELDS } from './index'
import { get, keyBy } from 'lodash'
import ProvinceApi from 'api/ProvinceApi'
import { replaceVietnameseStr } from 'utils/string'

export default class SelectProvinceForm extends React.Component {
  state = {
    provinces: [],
    data: {},
    searchString: '',
  }

  async componentDidMount() {
    let query = {}
    const rs = await ProvinceApi.getProvinces({}, query)
    const provinces = get(rs, 'data', [])
    const data = keyBy(provinces, 'key')
    this.setState({ provinces, data })
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getProvinces = () => {
    const { searchString, provinces } = this.state
    if (searchString) {
      const newSearchString = replaceVietnameseStr(searchString)
      return provinces.filter(province =>
        replaceVietnameseStr(province.name).includes(newSearchString)
      )
    }
    return provinces
  }

  render() {
    const { form, label, onChangeProvince } = this.props
    const provinces = this.getProvinces()
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.PROVINCES, {
          initialValue: '',
          onChange: value => onChangeProvince(value),
        })(
          <Select
            size="large"
            style={{ width: '100%' }}
            showSearch
            allowClear
            {...this.props}
            onSearch={this.handleSearch}
            defaultValue=""
            filterOption={false}
          >
            <Select.Option value={''}>{translate('chart.all')}</Select.Option>
            {provinces.map(({ key, name, _id }) => (
              <Select.Option key={key} value={_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        )}
      </FormItem>
    )
  }
}
