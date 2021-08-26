import { Select, Table } from 'antd'
import CategoryApi from 'api/CategoryApi'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import InputNumberCell from 'components/elements/input-number-cell'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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
      measuringList: [{ rowKey: Date.now().toString() }],
      measuringListSource: [],
      editRowKey: '',
      dataQCVN: [],
      isChangeQCVN: false,
    }
  }

  static propTypes = {
    qcvnId: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.array,
  }

  async componentDidMount() {
    this.setState({
      isLoaded: false,
    })
    const [measuringList] = await Promise.all([
      CategoryApi.getMeasurings({ page: 1, itemPerPage: 100000 }, {}),
    ])
    this.setState({
      measuringListSource: measuringList.data,
      isLoaded: true,
    })
    if (this.props.value) {
      this.setState({
        measuringList: (this.props.value || []).map(item => ({
          ...item,
          rowKey: item.key,
        })),
      })
    }
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
      // console.log(_.compact(dataSelect), "---_.compact(dataSelect)--")
      data.push(_.compact(dataSelect))
    }

    return data
  }

  handleOnChange = (value, index, flied) => {
    let itemQCVN = null
    if (flied === 'key') {
      const item = _.find(this.state.dataQCVN, obj => {
        return obj._id === this.props.qcvnId
      })
      if (item) {
        itemQCVN =
          item.measuringList.length > 0
            ? _.keyBy(item.measuringList, 'key')
            : null
      }
    }

    const dataValue = this.state.measuringList.map((item, i) => {
      if (index === i) {
        item[flied] = value
        if (flied === 'key' && itemQCVN) {
          const minLimit = itemQCVN[value] ? itemQCVN[value].minLimit : null
          const maxLimit = itemQCVN[value] ? itemQCVN[value].maxLimit : null
          item['isApplyQCVN'] = itemQCVN[value] ? true : false
          item['minLimit'] = minLimit
          item['maxLimit'] = maxLimit
        }
      }

      return {
        ...item,
      }
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
              if (this.state.isChangeQCVN && record.isApplyQCVN) {
                return <div className="disable-measuring">{text || '-'}</div>
              }

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
              if (this.state.isChangeQCVN && record.isApplyQCVN) {
                return <div className="disable-measuring">{text || '-'}</div>
              }

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
        title: translate('periodicalForecast.label.unit'),
      },
    ]
  }

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
        const dataFilter = _.map(this.state.measuringList, item => {
          if (item.key) {
            return item
          }
        })
        this.props.onChange(_.compact(dataFilter))
      }
    }

    //QCVN logic

    if (
      this.state.dataQCVN.length > 0 &&
      this.props.qcvnId !== prevProps.qcvnId
    ) {
      this.applyQCVN()
    }

    if (
      this.state.dataQCVN !== prevState.dataQCVN &&
      this.state.dataQCVN.length > 0
    ) {
      this.applyQCVN()
    }
  }

  applyQCVN = () => {
    this.setState({
      isChangeQCVN: false,
    })
    const item = _.find(this.state.dataQCVN, item => {
      return item._id === this.props.qcvnId
    })
    if (!item) {
      return
    }
    const result =
      item.measuringList.length > 0 ? _.keyBy(item.measuringList, 'key') : null
    if (result && this.state.measuringList.length > 0) {
      const dtMeasuring = _.map(this.state.measuringList, item => {
        const minLimit = result[item.key] ? result[item.key].minLimit : null
        const maxLimit = result[item.key] ? result[item.key].maxLimit : null
        return {
          ...item,
          minLimit,
          maxLimit,
          isApplyQCVN: result[item.key] ? true : false,
        }
      })
      this.setState({
        measuringList: dtMeasuring,
      })
    }
    this.setState({
      isChangeQCVN: true,
    })
  }

  render() {
    return (
      <WrapperComponent>
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
      </WrapperComponent>
    )
  }
}
