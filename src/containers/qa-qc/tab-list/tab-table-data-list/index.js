import React from 'react'
import { Table, InputNumber, Form, Checkbox } from 'antd'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import { SHAPE } from 'themes/color'
import * as _ from 'lodash'

import WarningIcon from '@atlaskit/icon/glyph/warning'
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink'

const DEVICE_STATUS = {
  '1': {
    color: 'orange',
    icon: <WarningIcon size="small" primaryColor="orange" />,
    title: `Sensor ${translate('monitoring.deviceStatus.maintenance')}`
  },
  '2': {
    color: 'red',
    title: `Sensor ${translate('monitoring.deviceStatus.broken')}`,
    icon: <EditorUnlinkIcon size="small" primaryColor="red" />
  }
}

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  handleClickOutside = e => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  save = () => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values }, values)
    })
  }

  render() {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props
    _.get(record, [`${dataIndex}.value`], '')
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: translate(`qaqc.notEmpty`, { value: title })
                      }
                    ],
                    initialValue: _.get(record, [`${dataIndex}`], '')
                  })(
                    <InputNumber
                      style={{ textAlign: 'right' }}
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                    />
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              )
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    )
  }
}

const TitleView = ({ name, unit }) => (
  <div style={{ textAlign: 'center' }}>
    {name} {unit && `(${unit})`}
  </div>
)

class EditableTable extends React.Component {
  getColor = value => {
    if (
      (_.includes(this.props.dataFilterBy, 'zero') && value === 0) ||
      (_.includes(this.props.dataFilterBy, 'nagative') && value < 0)
    ) {
      return SHAPE.RED
    } else {
      return 'transparent'
    }
  }

  onAllChange = e => {
    e.preventDefault()
  }

  onItemChange = (e, record) => {
    e.preventDefault()
  }

  getCols = props => {
    const me = this
    const indexCol = {
      title: '#',
      dataIndex: 'Index',
      key: 'Index',
      render(value, record, index) {
        const current = props.pagination.current
        const pageSize = props.pagination.pageSize
        return <div>{(current - 1) * pageSize + index + 1}</div>
      }
    }

    const checkCol = {
      title: <Checkbox onChange={me.onAllChange} />,
      dataIndex: 'Index',
      key: 'checked',
      width: 40,
      align: 'center',
      render(value, record, index) {
        return <Checkbox key={record} onChange={e => me.onItemChange(e, record)} />
      }
    }



    const timeCol = {
      title: translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return <div>{moment(value).format('YYYY/MM/DD HH:mm')}</div>
      }
    }

    const measureCols = _.filter(props.measuringData, measuring =>
      props.measuringList.includes(measuring.key)
    ).map(measuring => {
      return {
        title: <TitleView {...measuring} code={measuring.key} />,
        dataIndex: measuring.key,
        key: measuring.key,
        editable: _.isEqual(this.props.valueField, 'value'),
        render: (value, record) => {
          const statusDevice = _.get(
            record,
            `measuringLogs.${measuring.key}.statusDevice`,
            0
          )
          console.log('key', measuring.key)
          const st = _.get(DEVICE_STATUS, `${statusDevice}`, null)
          if (value === null) return <div />
          let backgroundColor = this.getColor(value)
          return (
            <div style={{ backgroundColor }}>
              {value && value.toLocaleString(navigator.language)}{' '}
              {st && st.icon}
            </div>
          )
        }
      }
    })

    return [indexCol, checkCol, timeCol, ...measureCols]
  }

  constructor(props) {
    super(props)
    const dataSource = _.map(
      props.dataSource,
      ({ _id, receivedAt, measuringLogs }, index) => {
        let rs = { receivedAt, _id, key: `${index}`, measuringLogs }
        _.mapKeys(measuringLogs, (value, key) => {
          rs[key] = _.get(value, this.props.valueField, _.get(value, 'value'))
          return key
        })
        return rs
      }
    )
    this.columns = this.getCols(this.props)
    this.state = {
      dataSource,
      dataChange: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataSource, this.props.dataSource)) {
      const dataSource = _.map(
        nextProps.dataSource,
        ({ _id, receivedAt, measuringLogs }, index) => {
          let rs = { receivedAt, _id, key: `${index}` }
          _.mapKeys(measuringLogs, (value, key) => {
            rs[key] = _.get(value, this.props.valueField, _.get(value, 'value'))
            return key
          })
          return rs
        }
      )
      this.columns = this.getCols(nextProps)
      this.setState({
        dataSource
      })
    }
  }

  handleSave = (row, values) => {
    const dataState = this.state
    let data = _.get(dataState.dataChange, [row._id], {})
    dataState.dataChange[row._id] = { ...data, ...values }
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    if (this.props.handleSave) {
      this.props.handleSave(dataState.dataChange)
    }
    this.setState({ dataSource: newData, dataChange: dataState.dataChange })
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`

  renderFooter = pageId => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <span>{DEVICE_STATUS['1'].icon}</span>
        <span style={{ paddingLeft: 8 }}>{DEVICE_STATUS['1'].title}</span>{' '}
        <span style={{ marginLeft: 16 }} />
        <span>{DEVICE_STATUS['2'].icon}</span>
        <span style={{ paddingLeft: 8 }}>{DEVICE_STATUS['2'].title}</span>
      </div>
    )
  }

  render() {
    const { dataSource } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          align: 'right',
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      }
    })
    return (
      <Table
        size="small"
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        rowKey="_id"
        dataSource={dataSource}
        columns={columns}
        pagination={{ ...this.props.pagination, showTotal: this.showTotal }}
        loading={this.props.loading}
        onChange={this.props.onChange}
        footer={this.renderFooter}
      />
    )
  }
}

export default EditableTable
