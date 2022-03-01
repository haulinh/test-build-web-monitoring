import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import SelectQCVN from 'components/elements/select-qcvn'
import _ from 'lodash'
import PropsTypes from 'prop-types'
import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'
import TableExceedQCVN from './TableExceedQCVN'

export default class AlarmConfigExceed extends Component {
  static propTypes = {
    initialValues: PropsTypes.object,
  }
  state = {
    dataSource: [
      {
        id: uuidv4(),
      },
      {
        id: uuidv4(),
      },
      {
        id: uuidv4(),
      },
    ],
    standardsVNObject: '',
    standardsVNObjectId: '',
    qcvnList: [],
  }

  async getDataQCVNByID(id) {
    const { qcvnList } = this.state
    const dataQCVN = await QCVNApi.getQCVNByID(id)

    this.setState({ qcvnList: [...qcvnList, dataQCVN.data] })
  }

  componentDidUpdate(prevProps, prevState) {
    const { standardsVNObjectId } = this.state
    if (standardsVNObjectId !== prevState.standardsVNObjectId) {
      this.getDataQCVNByID(standardsVNObjectId)
    }
  }

  onChange = e => {}

  onCheckAllChange = e => {
    console.log(e.target.checked)
  }

  changeQCVN(standardsVNObject, id) {
    const { form } = this.props
    const value = _.get(standardsVNObject, 'name', null)
    form.setFieldsValue({
      [`${FIELDS.EXCEED}.${id}.${FIELDS.QCVN_EXCEED}`]: value,
    })

    this.setState({
      standardsVNObject: value,
      standardsVNObjectId: standardsVNObject._id,
    })
  }

  columns = [
    {
      title: 'Ngưỡng',
      dataIndex: 'timeDisconnect',
      width: '15%',
      align: 'center',
      render: (value, record, index) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.EXCEED}.${record.id}.${FIELDS.QCVN_EXCEED}`,
              {}
            )(
              <SelectQCVN
                placeholder="Chọn ngưỡng"
                onHandleChange={value => this.changeQCVN(value, record.id)}
              />
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'user',
      align: 'center',
      width: '40%',
    },
    {
      title: 'Cảnh báo',
      width: '15%',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.EXCEED}.${record.id}.${FIELDS.ACTIVE_EXCEED}`,
              {
                initialValue: value || false,
                valuePropName: 'checked',
                onChange: this.onChange,
              }
            )(<Checkbox />)}
          </React.Fragment>
        )
      },
    },

    {
      title: '',
      width: '15%',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => this.handleDelete(record.id)}
          >
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <Icon type="delete" style={{ fontSize: '16px', color: 'red' }} />
            </div>
          </Popconfirm>
        ) : null,
    },
  ]

  handleDelete = id => {
    const { dataSource } = this.state
    const newDataSource = [...dataSource]
    this.setState({ dataSource: newDataSource.filter(item => item.id !== id) })
  }

  handleAdd = () => {
    const { dataSource } = this.state
    const id = uuidv4()
    const newData = {
      id: id,
    }

    this.setState({
      dataSource: [...dataSource, newData],
    })
  }

  getData = () => {
    const { qcvnList } = this.state
    const data = qcvnList.reduce((base, current) => {
      current.measuringList.forEach(measuring => {
        let findObj = base.find(o => o.key === measuring.key)
        console.log('findObj----------->', findObj)
        if (!findObj) {
          base.push({
            key: measuring.key,
            [current._id]: {
              minLimit: measuring.minLimit,
              maxLimit: measuring.maxLimit,
            },
          })
        } else {
          findObj[current._id] = {
            minLimit: measuring.minLimit,
            maxLimit: measuring.maxLimit,
          }
        }
      })
      return base
    }, [])
    return data
  }

  render() {
    const { dataSource } = this.state

    return (
      <div>
        <div className="title">Cảnh báo vượt ngưỡng</div>

        <Table
          columns={this.columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          footer={() => (
            <Button
              type="link"
              style={{ fontWeight: 'bold' }}
              onClick={this.handleAdd}
            >
              <Icon type="plus" />
              Thêm
            </Button>
          )}
        />
        <Clearfix height={12} />
        <TableExceedQCVN
          qcvnList={this.state.qcvnList}
          dataSource={this.getData()}
        />
      </div>
    )
  }
}
