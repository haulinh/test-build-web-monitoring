import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Row, Table, Button, Checkbox, Modal } from 'antd'
import { translate } from 'hoc/create-lang'
import moment from 'moment'
import * as _ from 'lodash'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { EditableFormRow, EditableCell } from './table-row'

export const myKeyframes = props => keyframes`
50% { color: ${props.color || 'red'}; }
0% { color: ${props.color1 || 'black'}; }
100% { color: ${props.color || 'red'}; }
`

const Wrapper = styled.div``
const FooterView = styled.div` display: flex; flex-direction: row; justify-content: flex-start;`
const FooterItem = styled.span` padding-left: 4px; padding-right: 4px; 
  animation: ${props => `${myKeyframes(props)} ${props.tick || 0.5}s infinite;`}`

  // color: props.color || 'black', color1: props.color1
  // `${myKeyframes(props)} ${props.tick || 0.5}s infinite;`};

const ToolbarView = styled.div`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  flex-direction: row;
  justify-content: flex-end;
`

export default class TableList extends React.PureComponent {

  constructor (props) {
    super (props)
    this.state = {
      list: [],
      manualVisible: false,
      optionsManual: []
    }
    this.setColumns(props)    
  }

  renderValue = (value, record, index, code) => {
    let fieldValue = _.get(this.props, 'searchFormData.dataType', 'value')
    if (fieldValue === 'yetApprove') {
      fieldValue = 'approvedValue'
    }

    if (_.has(this.props, ['dataChange', record._id, code])) {
      _.setWith(value, `${fieldValue}`, _.get(this.props, ['dataChange', record._id, code], ''))
    }

    const originValue = _.get(value, fieldValue === 'value' ? 'approvedValue' : 'value', '')
    let updateValue = `${_.get(value, fieldValue, '')}`
    if (fieldValue === 'value' && updateValue !== '' && `${updateValue}` !== `${originValue}` && originValue !== '') {
      updateValue = `${updateValue} (${originValue})`
    } 

    let color = 'back'
    if (fieldValue === 'value') {
      if (_.get(record, ['measuringLogs', code, 'hasApproved'])) {
        color = 'blue'
      }

      if (_.has(record, ['measuringLogs', code, 'removeValue'])) {
        color = 'red'
      }
    }

    return <span style={{ color }}>{updateValue}</span>
  }

  setIndex = (value, record, index) => {
    const current = _.get(this.props, 'pagination.current', 0)
    const pageSize = _.get(this.props, 'pagination.pageSize', 0)
    return `${current * pageSize - pageSize + index + 1}`
  }

  handleSave = (row, value) => {
    const dataChange = _.get(this.props, 'dataChange', {})
    let oldData = _.get(dataChange, [row._id], {})
    dataChange[row._id] = _.merge(oldData, value)
    const newData = _.clone(this.props.data)
    const index = newData.findIndex(item => row._id === item._id)
    newData[index] = row  
    if (this.props.handleSave) {
      this.props.handleSave(newData, dataChange)
    }
  }

  onAllChecked = e => {
    this.props.onRowChecked('__ALL__', _.get(e, 'target.checked', false))
    this.setState({list: []})
  }

  onItemChecked = e => {
    e.preventDefault()
    const record = e.target.record
    this.setState({list: [record]})
    this.props.onRowChecked(record._id, _.get(e, 'target.checked', false))
  }

  setColumns = props => {
    const fieldValue = _.get(props, 'searchFormData.dataType', 'value')
    const measureCol = _.map(_.get(props, 'searchFormData.measuringData', []), ({ key, name, unit }) => ({
      title: `${name} ${unit ? `(${unit})` : ''}`,
      dataIndex: `measuringLogs.${key}`,
      key,
      align: 'center',
      fieldValue,
      editable: fieldValue === 'yetApprove',
      render: (value, record, index) => this.renderValue(value, record, index, key),
    }))

    this.columns = [
      {
        title: '#',
        dataIndex: 'Index',
        key: 'Index',
        width: 60,
        align: 'center',
        render: this.setIndex
      }, {
        title: translate('dataSearchFrom.table.receivedAt'),
        dataIndex: 'receivedAt',
        key: 'receivedAt',
        width: 150,
        align: 'center',
        render: value => moment(value).format(DD_MM_YYYY_HH_MM)
      },
      ...measureCol
    ]

    if (fieldValue !== 'value') {
      const isAllChecked = _.get(props, 'dataSelected.checked', false)
      this.columns.unshift({
        title: <Checkbox onChange={this.onAllChecked} defaultChecked={isAllChecked} />,
        dataIndex: 'checked',
        key: 'checked',
        width: 30,
        align: 'center',
        render: (value, record) => {
          const _checked = _.get(props, 'dataSelected.checked', false)
          const ls = _.get(props, 'dataSelected.list', [])
          const itemChecked = _checked ? !_.includes(ls, record._id) : _.includes(ls, record._id)
          return <Checkbox 
            onChange={this.onItemChecked}
            record={record}
            checked={itemChecked}
          />
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    // if (!_.isEqual(this.props, nextProps)) {
      this.setColumns(nextProps)
    // }
  }

  renderTableFooter = () => {
    if (_.get(this.props, 'searchFormData.dataType', 'value') === 'value') 
    return (
      <FooterView>
        <FooterItem color='black'>{translate('qaqc.yetApprove')}</FooterItem>
        <FooterItem tick={0.8} color='blue'>{translate('qaqc.approved')}</FooterItem>
        <FooterItem color='red'>{translate('qaqc.removeData')}</FooterItem>
      </FooterView>
    )

    return null
  }

  preRender = () => {
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          if (_.has(this.props, ['dataChange', record._id, col.key])) {
            _.setWith(record, `measuringLogs.${col.key}.${col.fieldValue}`, _.get(this.props, ['dataChange', record._id, col.key], ''))
          }
          return ({
            record, code: col.key,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            fieldValue: col.fieldValue,
            handleSave: this.handleSave,
          })
        },
      };
    })

    return {
      components: {
        body: {
          row: EditableFormRow,
          cell: EditableCell
        }
      },
      columns
    }
  }

  renderToolbar = () => {
    const fieldValue = _.get(this.props, 'searchFormData.dataType', 'value')
    const hasApprove = fieldValue === 'yetApprove' && (this.props.dataSelected.checked || this.props.dataSelected.list.length > 0)
    return (
      <ToolbarView>
        {
          hasApprove && protectRole(ROLE.QAQC.REMOVE)(<Button type='danger' icon='delete' style={{marginRight: 8}} onClick={this.props.onRemoved}>{translate('qaqc.remove')}</Button>)
        }

        {
          fieldValue === 'yetApprove'  && 
          protectRole(ROLE.QAQC.MANUAL_APPROVE)(<Button type='primary' style={{marginRight: 8}} onClick={() => this.setState({manualVisible: true})}>{translate('qaqc.manualApprove')}</Button>)
        }

        {
          hasApprove && protectRole(ROLE.QAQC.APPROVE)(<Button type='primary' onClick={this.props.onApproved}>{translate('qaqc.approve')}</Button>)
        }

        {
          fieldValue === 'removeValue' && protectRole(ROLE.QAQC.RESTORE)(<Button type='primary' onClick={this.props.onRestoreData}>{translate('qaqc.restore')}</Button>)
        }

        {
          fieldValue === 'approvedValue' && protectRole(ROLE.QAQC.UN_APPROVE)(<Button type='primary' onClick={this.props.onUnApprove}>{translate('qaqc.unApprove')}</Button>)
        }

      </ToolbarView>
    )
  }

  onRuleChecked = optionsManual => {
    this.setState({optionsManual})
  }

  renderManualModal = ()  => {
    return (
      <Modal
        title={translate('qaqc.manualApprove')}
        cancelText={translate('qaqc.cancel')}
        okText={translate('qaqc.ok')}
        visible={this.state.manualVisible}
        onOk={() => {
          this.props.onManualApproved(this.state.optionsManual)
          this.setState({ manualVisible: false, optionsManual: [] })
        }}
        onCancel={() => this.setState({ manualVisible: false, optionsManual: [] })}
      >
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={this.onRuleChecked}
          value={this.state.optionsManual}
        >
          <Row>
            <h5>{translate('qaqc.removeDataBy')}</h5>
          </Row>
          <Row>
            <Checkbox value="ZERO">
              {translate('qaqc.dataFilter.isZero')}
            </Checkbox>
          </Row>
          <Row>
            <Checkbox value="NEGATIVE">
              {translate('qaqc.dataFilter.negative')}
            </Checkbox>
          </Row>
          <Row>
            <Checkbox value="OUT_RANGE">
              {translate('qaqc.outOfRange')}
            </Checkbox>
          </Row>
          <Row>
            <Checkbox value="DEVICE_STATUS">
              {translate('qaqc.dataFilter.deviceStatus')}
            </Checkbox>
          </Row>
        </Checkbox.Group>
      </Modal>
    )
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`

  render() {
    const me = this.preRender()
    return (
      <Wrapper>
        {this.renderToolbar()}
        <Row>
          <Table
            rowKey='_id'
            components={me.components}
            bordered size='small'
            dataSource={this.props.data || []}
            columns={me.columns}
            onChange={this.props.onChangePage}
            pagination={{...this.props.pagination, showTotal: this.showTotal}}
            // title={() => this.renderTableHeader()}
            footer={() => this.renderTableFooter()}

          />
        </Row>
        { this.renderManualModal() }
      </Wrapper>
    )
  }
}
