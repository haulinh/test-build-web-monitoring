import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Select } from 'antd'
import * as _ from 'lodash'

import { translate } from 'hoc/create-lang'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import CategoryApi from 'api/CategoryApi'
import InputNumberCell from 'components/elements/input-number-cell'

const i18n = {
  key: translate('stationFixedPoint.form.measuringForm.key'),
  name: translate('stationFixedPoint.form.measuringForm.name'),
  addMeasuring: translate('stationFixedPoint.form.measuringForm.addMeasuring'),
  tendToExceed: translate('stationFixedPoint.form.measuringForm.tendToExceed'),
  qcvn: translate('stationFixedPoint.form.measuringForm.qcvn'),
  qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
  qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
}

export default class MeasuringList extends React.Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      isLoaded: true,
      measuringList: undefined,
      measuringListSource: [],
      editRowKey: '',
    }
  }

  static propTypes = {
    onChange: PropTypes.func,
  }

  async componentDidMount() {
    const measuringList = await CategoryApi.getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )
    this.setState({
      measuringListSource: measuringList.data,
    })
  }
  getOptions = () => {
    const data = _.get(this.state, 'measuringListSource', []).map(d => (
      <Select.Option key={d.key} value={d.key}>
        {d.name}
      </Select.Option>
    ))
    return data
  }

  handleOnChange = (value, index, flied) => {
    const dataValue = this.state.measuringList.map((item, i) => {
      if (index === i) {
        item[flied] = value
      }
      return item
    })
    this.setState({
      measuringList: dataValue,
    })
  }

  setUpColumns = () => {
    return [
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
          } else {
            return text
          }
        },
      },
      {
        title: i18n.qcvn,
        children: [
          {
            dataIndex: 'minLimit',
            align: 'center',
            title: i18n.qcvnMin,
            width: 150,
            render: (text, record, index) => {
              if (record.rowKey === this.state.editRowKey) {
                return (
                  <InputNumberCell
                    value={text}
                    onChange={value =>
                      this.handleOnChange(value, index, 'minLimit')
                    }
                    editable
                  />
                )
              } else {
                return text
              }
            },
          },
          {
            dataIndex: 'maxLimit',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
            render: (text, record, index) => {
              if (record.rowKey === this.state.editRowKey) {
                return (
                  <InputNumberCell
                    value={text}
                    onChange={e => this.handleOnChange(e, index, 'maxLimit')}
                    editable
                  />
                )
              } else {
                return text
              }
            },
          },
        ],
      },
      {
        title: i18n.tendToExceed,
        children: [
          {
            dataIndex: 'minTend',
            align: 'center',
            title: i18n.qcvnMin,
            width: 150,
            render: (text, record, index) => {
              if (record.rowKey === this.state.editRowKey) {
                return (
                  <InputNumberCell
                    value={text}
                    onChange={value =>
                      this.handleOnChange(value, index, 'minTend')
                    }
                    editable
                  />
                )
              } else {
                return text
              }
            },
          },
          {
            dataIndex: 'maxTend',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
            render: (text, record, index) => {
              if (record.rowKey === this.state.editRowKey) {
                return (
                  <InputNumberCell
                    value={text}
                    onChange={value =>
                      this.handleOnChange(value, index, 'maxTend')
                    }
                    editable
                  />
                )
              } else {
                return text
              }
            },
          },
        ],
      },
      {
        dataIndex: 'unit',
        align: 'center',
        title: 'Đơn vị',
      },
      {
        title: '',
        render: (text, record, index) => {
            if (record.rowKey === this.state.editRowKey) {
              return (
                <InputNumberCell
                  value={text}
                  onChange={value =>
                    this.handleOnChange(value, index, 'maxTend')
                  }
                  editable
                />
              )
            } else {
              return text
            }
          },
      },
    ]
  }

  handleAddRow = () => {
    let rowNew = {
      rowKey: `key_${
        this.state.measuringList ? this.state.measuringList.length + 1 : 1
      }`,
    }
    let dataSource = this.state.measuringList || []
    dataSource.push(rowNew)
    this.setState({
      measuringList: dataSource,
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.measuringList !== this.state.measuringList) {
      if (this.props.onChange) {
        this.props.onChange(this.state.measuringList)
      }
    }
  }

  render() {
    // console.log(this.state.measuringList, '--measuringList--')
    return (
      <div>
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
            columns={this.setUpColumns()}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
          />
        )}
      </div>
    )
  }
}
