import { Button, Icon, Popconfirm, Select, Table } from 'antd'
import CategoryApi from 'api/CategoryApi'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import InputNumberCell from 'components/elements/input-number-cell'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

// const i18n = {
//   stt: 'STT',
//   measureKey: 'Mã thông số',
//   measureName: 'Thông số ô nhiễm tính phí',
//   value: 'Giá trị',
// }

const WrapperComponent = styled.div`
  .disable-measuring {
    opacity: 0.7;
    font-weight: bold;
    background: #4e4e4e;
  }
`

const i18n = {
  key: translate('stationFixedPoint.form.measuringForm.key'),
  name: translate('stationFixedPoint.form.measuringForm.name'),
  addMeasuring: translate('stationFixedPoint.form.measuringForm.addMeasuring'),
  tendToExceed: translate('stationFixedPoint.form.measuringForm.tendToExceed'),
  qcvn: translate('stationFixedPoint.form.measuringForm.qcvn'),
  qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
  qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
  delete: translate('stationFixedPoint.delete.require'),
}

export default class MeasuringList extends React.Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      isLoaded: false,
      measuringList: undefined,
      measuringListSource: [],
      editRowKey: '',
    }
  }

  async componentDidMount() {
    this.setState({
      isLoaded: false,
    })
    const [measuringList] = await Promise.all([
      CategoryApi.getMeasurings({ page: 1, itemPerPage: 100000 }, {}),
    ])
    if (this.props.onFetchMeasuringListSuccess) {
      this.props.onFetchMeasuringListSuccess(measuringList.data)
    }
    console.log({ value: this.props.value })
    this.setState({
      measuringListSource: measuringList.data,
      measuringList: (this.props.value || []).map(item => ({
        ...item,
        rowKey: item.key,
      })),
      isLoaded: true,
    })
  }

  getOptions = () => {
    const diffData =
      _.differenceBy(
        this.state.measuringListSource,
        this.state.measuringList,
        'key'
      ) || []

    let data = diffData.map(d => (
      <Select.Option key={d.key} value={d.key}>
        {d.name}
      </Select.Option>
    ))

    if (this.state.measuringList.length > 0) {
      const dataSelect = this.state.measuringList.map(d => {
        if (!d.key) {
          return undefined
        }
        return (
          <Select.Option disabled key={d.rowKey} value={d.key}>
            {d.name}
          </Select.Option>
        )
      })
      data.push(_.compact(dataSelect))
    }

    return data
  }

  handleOnChange = (value, index, flied) => {
    const dataValue = this.state.measuringList.map((item, i) => {
      if (index === i) {
        item[flied] = value
      }
      return {
        ...item,
      }
    })

    this.setState({
      measuringList: dataValue,
    })
  }

  columns = [
    {
      dataIndex: 'key',
      align: 'center',
      title: i18n.key,
      width: 130,
    },
    {
      dataIndex: 'name',
      align: 'center',
      title: i18n.name,
      render: (text, record, index) => {
        if (record.rowKey === this.state.editRowKey) {
          const value = this.state.measuringList[index].key
          return (
            <AutoCompleteCell
              editable
              style={{ width: 120 }}
              onChange={value => {
                const obj = _.find(this.state.measuringListSource, item => {
                  return item.key === value
                })
                this.handleOnChange(obj.key, index, 'key')
                this.handleOnChange(obj.name, index, 'name')
                this.handleOnChange(obj.unit, index, 'unit')
              }}
              value={value}
              options={this.getOptions()}
            />
          )
        }

        return text
      },
    },
    {
      dataIndex: 'value',
      align: 'center',
      title: i18n.qcvnMax,
      width: 150,
      render: (text, record, index) => {
        if (record.rowKey === this.state.editRowKey) {
          return (
            <InputNumberCell
              value={text}
              onChange={e => this.handleOnChange(e, index, 'value')}
              editable
            />
          )
        }
        return text
      },
    },
    {
      title: '',
      render: (text, record, index) => {
        return (
          <div
            style={{
              textAlign: 'center',
            }}
            className="editable-row-operations"
          >
            <span>
              <Popconfirm
                title={i18n.delete}
                onConfirm={() => this.handleRemoveRow(index)}
              >
                <a>
                  <Icon
                    type="delete"
                    style={{ marginLeft: '5px', color: 'red' }}
                  />
                </a>
              </Popconfirm>
            </span>
          </div>
        )
      },
    },
  ]

  handleAddRow = () => {
    let rowNew = {
      rowKey: Date.now().toString(),
    }
    let dataSource = this.state.measuringList || []
    dataSource.push(rowNew)
    this.setState({
      measuringList: dataSource,
    })
  }

  handleRemoveRow(index) {
    const dataSource = _.clone(this.state.measuringList)
    dataSource.splice(index, 1)
    this.setState({
      measuringList: dataSource,
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.measuringList !== this.state.measuringList) {
      if (this.props.onChange) {
        const measuringList = this.state.measuringList.filter(item => item.key)
        this.props.onChange(_.compact(measuringList))
      }
    }
  }

  render() {
    return (
      <WrapperComponent>
        <Button
          style={{ right: '0', marginBottom: '16px' }}
          type="primary"
          size="large"
          onClick={this.handleAddRow}
        >
          {i18n.addMeasuring}
        </Button>
        {this.state.isLoaded && (
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  this.setState({
                    editRowKey: event.currentTarget.dataset.rowKey,
                  })
                }, // click row
                // onDoubleClick: event => {}, // double click row
                // onContextMenu: event => {}, // right button click row
                // onMouseEnter: event => {}, // mouse enter row
                // onMouseLeave: event => {}, // mouse leave row
              }
            }}
            bordered
            rowKey="rowKey"
            dataSource={this.state.measuringList}
            columns={this.columns}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
          />
        )}
      </WrapperComponent>
    )
  }
}
