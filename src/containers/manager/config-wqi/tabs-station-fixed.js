import React from 'react'
import { Table, Radio, Form, Icon, message } from 'antd'
import SearchForm from './search-form'
import { translate } from 'hoc/create-lang'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

const RadioGroup = Radio.Group

class TabsStationFixed extends React.Component {
  state = {
    list: [],
    pagination: {},
    stationTypes: [],
    loading: false,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async ({ page = 1 } = {}) => {
    this.setState({ loading: true })
    const results = await StationFixedPointApi.getStationFixedPoints(
      {
        page,
        itemPerPage: Number.MAX_SAFE_INTEGER,
      },
      undefined,
      { active: true }
    )

    const stationTypes = new Map(
      results.data.map(item => [item.stationType.key, item.stationType])
    )
    this.setState(
      {
        stationTypes: Array.from(stationTypes).map(item => ({
          value: item[1].key,
          text: item[1].name,
        })),
        loading: false,
        list: results.data,
        pagination: results.pagination,
      },
      this.setFormData
    )
    return results
  }

  setFormData = () => {
    const { form } = this.props
    const { list } = this.state
    const values = list.reduce((prev, item) => {
      const filed = `${item._id}[calculateType]`
      form.getFieldDecorator(filed)
      return {
        ...prev,
        [filed]: item.calculateType,
      }
    }, {})
    form.setFieldsValue(values)
  }

  getColumns() {
    const { form } = this.props
    const { stationTypes } = this.state

    const columns = [
      {
        title: translate('configWQI.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
      },
      {
        title: translate('configWQI.stationType'),
        dataIndex: 'stationType',
        align: 'left',
        filters: stationTypes,
        onFilter: (value, record) =>
          get(record, 'stationType.key').indexOf(value) === 0,
        filterIcon: filtered => (
          <Icon
            type="filter"
            style={{ color: filtered ? '#1890ff' : undefined }}
          />
        ),
        render: value => get(value, 'name', ''),
      },
      {
        title: translate('configWQI.allow'),
        key: 'radio',
        align: 'left',
        render: record => {
          const field = `${record._id}[calculateType]`
          const isSelected = ['WQI', 'AQI'].includes(form.getFieldValue(field))
          return (
            <Form.Item style={{ margin: 0 }}>
              {form.getFieldDecorator(field, {
                valuePropName: 'checked',
              })(
                <RadioGroup
                  onChange={({ target: { value } }) =>
                    this.onUpdate(record._id, value)
                  }
                  value={form.getFieldValue(field)}
                >
                  <Radio value={'WQI'}>WQI</Radio>
                  <Radio value={'AQI'}>AQI</Radio>
                  {isSelected && (
                    <Radio value={'UNCHECK'}>
                      {translate('configWQI.unckecked')}
                    </Radio>
                  )}
                </RadioGroup>
              )}
            </Form.Item>
          )
        },
      },
    ]
    return columns
  }

  onUpdate = (id, value) => {
    setTimeout(async () => {
      const { form } = this.props
      const field = `${id}[calculateType]`
      const calculateType = value !== 'UNCHECK' ? value : null
      try {
        await StationFixedPointApi.updateConfig(id, { calculateType })
        if (!calculateType) form.setFieldsValue({ [field]: null })
        this.setState(({ list }) => ({
          list: list.map(item => {
            if (item._id === id) return { ...item, calculateType }
            return item
          }),
        }))
        message.info(translate('configWQI.success'))
      } catch (e) {
        console.log(e)
      }
    })
  }

  onPageChange = () => {
    this.setFormData()
  }

  onSearch = textSearch => {
    this.setState({ textSearch, current: 1 })
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`

  getData = () => {
    const { list, textSearch = '', pagination } = this.state

    const filteredList = textSearch
      ? list.filter(
          item =>
            replaceVietnameseStr(item.name.toLowerCase()).indexOf(
              replaceVietnameseStr(textSearch.toLowerCase())
            ) >= 0
        )
      : list

    return {
      list: filteredList,
      pagination: {
        ...pagination,
        showTotal: this.showTotal,
        total: filteredList.length,
        pageSize: 10,
      },
    }
  }

  render() {
    const { loading } = this.state
    const data = this.getData()

    return (
      <div>
        <SearchForm onSearch={this.onSearch} />
        <Table
          rowKey="key"
          loading={loading}
          dataSource={data.list}
          columns={this.getColumns()}
          onChange={this.onPageChange}
          pagination={{ showTotal: this.showTotal }}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{get(record, 'address', '')}</p>
          )}
        />
      </div>
    )
  }
}

export default Form.create()(TabsStationFixed)
