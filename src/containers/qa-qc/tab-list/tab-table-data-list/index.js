import React from 'react'
import { Table, InputNumber, Form, Checkbox } from 'antd'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import { SHAPE } from 'themes/color'
import * as _ from 'lodash'

import WarningIcon from '@atlaskit/icon/glyph/warning'
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink'
import styled, { keyframes } from 'styled-components'

export const myKeyframes = props => keyframes`
50% { color: ${props.color || 'red'}; }
0% { color: black; }
100% { color: ${props.color || 'red'}; }
`

const LightNote = styled.span`
  animation: ${props =>
    `${myKeyframes({ color: props.color || 'red' })} ${props.tick ||
      0.5}s infinite;`};
`

const DEVICE_STATUS = {
  D1: {
    color: 'orange',
    icon: <WarningIcon label="" size="small" primaryColor="orange" />,
    title: `Sensor ${translate('monitoring.deviceStatus.maintenance')}`
  },
  D2: {
    color: 'red',
    title: `Sensor ${translate('monitoring.deviceStatus.broken')}`,
    icon: <EditorUnlinkIcon label="" size="small" primaryColor="red" />
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
    console.log(this.props, record)
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

const TitleView = ({ name, unit, isPublish, onChange, code, checked }) => (
  <div style={{ textAlign: 'center'}}>
    {isPublish && <div><Checkbox onChange={onChange} code={code} checked={checked}/></div>}
    {isPublish && <div style={{height: 1, background: '#cdcdcd', marginTop: 2, marginBottom: 2}}></div>}
    <div>{name} {unit && `(${unit})`}</div>
  </div>
)

const TimeView = ({isPublish }) => (
  <div style={{ textAlign: 'left'}}>
    {isPublish && <div>{translate('qaqc.publish')}</div>}
    {isPublish && <div style={{height: 1, background: '#cdcdcd', marginTop: 2, marginBottom: 2}}></div>}
    <div>{translate('dataSearchFrom.table.receivedAt')}</div>
  </div>
)

class EditableTable extends React.Component {
  getColor = (props, value) => {
    if (
      (_.includes(props.dataFilterBy, 'zero') && value === 0) ||
      (_.includes(props.dataFilterBy, 'nagative') && value < 0)
    ) {
      return SHAPE.RED
    } else {
      // return 'transparent'
      return 'black'
    }
  }

  onAllChange = e => {
    e.preventDefault()
    this.props.onItemChecked('ALL', _.get(e, 'target.checked', false))
  }

  onItemChange = (e, record) => {
    e.preventDefault()
    this.props.onItemChecked(record._id, _.get(e, 'target.checked', false))
  }

  onChangeApproved = e => {
    const item = _.get(e, 'target.code', null)
    let publishedList = _.get(this.props, 'published.publishedList', [])
    if (_.get(e, 'target.checked', false)) {
      publishedList = _.union(publishedList, [item])
    } else {
      publishedList = _.filter(publishedList, it => it !== item)
    }
    this.props.onPublishChange({...this.props.published, publishedList})
  }

  getCols = props => {
    const isOriginal = props.valueField === 'original'
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
      title: <Checkbox value={props.checkedAll} onChange={me.onAllChange} />,
      dataIndex: 'Index',
      key: 'checked',
      width: 40,
      align: 'center',
      render(value, record, index) {
        return (
          <Checkbox key={record} onChange={e => me.onItemChange(e, record)} />
        )
      }
    }

    const timeCol = {
      title: <TimeView isPublish={!isOriginal}/>,//translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return <div>{moment(value).format('YYYY/MM/DD HH:mm')}</div>
      }
    }

    
    const measureCols = _.filter(props.measuringData, measuring =>
      props.measuringList.includes(measuring.key)
    ).map(measuring => {
      const col = {
        title: <TitleView isPublish={!isOriginal} {...measuring} 
          code={measuring.key}
          checked={_.includes(_.get(props, 'published.publishedList', []), measuring.key)}
          onChange={me.onChangeApproved}/>,
        dataIndex: measuring.key,
        key: measuring.key,
        editable: _.isEqual(props.valueField, 'value'),
        render: (value, record) => {
          const statusDevice = _.get(
            record,
            `measuringLogs.${measuring.key}.statusDevice`,
            0
          )

          const st = _.get(DEVICE_STATUS, `D${statusDevice}`, null)
          let color = this.getColor(props, value)
          let text = ''
          if (isOriginal) {
            const approvedValue = _.get(
              record,
              `measuringLogs.${measuring.key}.approvedValue`,
              null
            )
            if (approvedValue === null) {
              color = 'black'
            } else {
              color = 'blue'
            }
          } else if (props.valueField === 'approvedValue') {
            const valueOriginal = _.get(
              record,
              `measuringLogs.${measuring.key}.value`,
              null
            )
            if (valueOriginal !== value) {
              text = ` (${valueOriginal})`
            }
          }

          if (value === null) return <div />
          return (
            <div style={{ color, textAlign: "right" }}>
              {value && value.toLocaleString(navigator.language)} {text}
              {st && st.icon}
            </div>
          )
        }
      }
      return col
      // return {
      //   title: <Checkbox code={measuring.key} checked={_.includes(_.get(props, 'published.publishedList', []), measuring.key)} onChange={me.onChangeApproved}/>, 
      //   children: [col]}
    
    })

    if (isOriginal) return [indexCol, timeCol, ...measureCols]
    return [indexCol, checkCol, timeCol, ...measureCols]
  }

  constructor(props) {
    super(props)
    const dataSource = _.map(
      props.dataSource,
      ({ _id, receivedAt, measuringLogs }, index) => {
        let rs = { receivedAt, _id, key: `${index}`, measuringLogs }
        _.mapKeys(measuringLogs, (value, key) => {
          rs[key] = _.get(value, props.valueField, _.get(value, 'value'))
          return key
        })
        return rs
      }
    )
    
    this.columns = this.getCols(props)
    this.state = {
      dataSource,
      dataChange: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.dataSource, this.props.dataSource) ||
      !_.isEqual(nextProps.checkedAll, this.props.checkedAll) ||
      !_.isEqual(nextProps.valueField, this.props.valueField) ||
      !_.isEqual(nextProps.published, this.props.published) ||
      !_.isEqual(nextProps.dataChange, this.props.dataChange) ||
      !_.isEqual(nextProps.listChecked, this.props.listChecked)
    ) {
      const dataSource = _.map(
        nextProps.dataSource,
        ({ _id, receivedAt, measuringLogs }, index) => {
          let rs = { receivedAt, _id, key: `${index}`, measuringLogs }
          _.mapKeys(measuringLogs, (value, key) => {
            rs[key] = _.get(value, nextProps.valueField, _.get(value, 'value'))
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
        <span>{DEVICE_STATUS['D1'].icon}</span>
        <LightNote color="orange" tick={0.7} style={{ paddingLeft: 8 }}>
          {DEVICE_STATUS['D1'].title}
        </LightNote>{' '}
        <span style={{ marginLeft: 16 }} />
        <span>| {DEVICE_STATUS['D2'].icon}</span>
        <LightNote style={{ paddingLeft: 8 }}>
          {DEVICE_STATUS['D2'].title}
        </LightNote>
        {this.props.valueField === 'original' && (
          <LightNote color="blue" style={{ paddingLeft: 8 }}>
            | {translate('qaqc.approved')}
          </LightNote>
        )}
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
