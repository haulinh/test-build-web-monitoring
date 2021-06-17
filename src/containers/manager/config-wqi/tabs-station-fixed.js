import React from 'react'
import { Table, Radio, Form, Icon, message } from 'antd'
import SearchForm from './search-form'
import { translate } from 'hoc/create-lang'
import StationFixedPointApi from 'api/station-fixed/StationFixedPointApi'
import { get } from 'lodash'
import {replaceVietnameseStr} from 'utils/string'

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
    this.setState({ loading: true});
    const results = await StationFixedPointApi.getStationFixedPoints(
      { page, itemPerPage: Number.MAX_SAFE_INTEGER },
    );

    const stationTypes = new Map(results.data.map(item => [item.stationType.key, item.stationType]));
    this.setState({
      stationTypes: Array.from(stationTypes).map(item => ({value: item[1].key, text: item[1].name})),
      loading: false,
      list: results.data,
      pagination: results.pagination   
    }, () => {
      const {form} = this.props;
      const initialValue = results.data.reduce((prev, item) => ({
        ...prev,
        [`${item._id}[calculateType]`]: item.calculateType
      }), {})
      form.setFieldsValue(initialValue)
    });
    return results;
  }

  getColumns() {
    const { form } = this.props;
    const { stationTypes } = this.state;

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
            <Form.Item style={{margin: 0}}>
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
        await StationFixedPointApi.updateConfig(id, {calculateType})
        if (!calculateType) form.setFieldsValue({ [field]: null })
        message.info(translate('configWQI.success'))
      } catch (e) {
        console.log(e)
      }
    })
  }

  onPageChange = ({current}) => {
    this.setState(({pagination}) => ({pagination: {...pagination, current}}))
  }

  onSearch = (textSearch) => {
    this.setState({textSearch, current: 1})
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`

  getData = () => {
    const { list, textSearch = '', pagination } = this.state

    const newList = list.filter(item =>
      replaceVietnameseStr(item.name.toLowerCase())
      .indexOf(replaceVietnameseStr(textSearch.toLowerCase())) >= 0
    )

    return {
      list: textSearch ? newList : list,
      pagination: { 
        ...pagination, 
        showTotal: this.showTotal,
        total: newList.length,
        pageSize: pagination.limit 
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
          pagination={data.pagination}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{get(record, 'address', '')}</p>
          )}
        />
      </div>
    )
  }
}

export default Form.create()(TabsStationFixed)
