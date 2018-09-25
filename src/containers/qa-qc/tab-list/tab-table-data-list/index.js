import React from 'react'
import { Table, InputNumber, Form } from 'antd';
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import { SHAPE } from 'themes/color'
import * as _ from 'lodash'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values }, values);
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    _.get(record, [`${dataIndex}.value`] , '')
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: translate(`qaqc.notEmpty`, {value: title}),
                      }],
                      initialValue: _.get(record, [`${dataIndex}`] , '')
                    })(
                      <InputNumber
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends React.Component {

  getColor = value => {
    if ((_.includes(this.props.dataFilterBy, 'zero') && value === 0)
      || (_.includes(this.props.dataFilterBy, 'nagative') && value < 0)
    ) {
      return SHAPE.RED
    } else {
      return SHAPE.BLACK
    }
  }

  getCols = (props) => {
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

    const timeCol = {
      title: translate('dataSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      render(value) {
        return <div>{moment(value).format('YYYY/MM/DD HH:mm')}</div>
      }
    }

    const measureCols = 
      _.filter(props.measuringData, measuring => props.measuringList.includes(measuring.key))
      .map(measuring => {
        return {
          title:
            `${measuring.name}` +
            (measuring.unit && measuring.unit !== ''
              ? `(${measuring.unit})`
              : ''),
          dataIndex: measuring.key,
          key: measuring.key,
          editable: true,
          render: value => {
            if (value === null) return <div />
            let color = this.getColor(value)
            return (
              <div style={{ color }}>
                {value && value.toLocaleString(navigator.language)}
              </div>
            )
          }
        }
      })

    return [indexCol, timeCol, ...measureCols];
  }

  constructor(props) {
    super(props);
    this.columns = this.getCols(this.props)
    this.state = {
      dataSource: this.props.dataSource,
      dataChange: {}
    };
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.dataSource, this.props.dataSource)) {
      const dataSource = _.map(nextProps.dataSource, ({_id, receivedAt, measuringLogs}, index) => {
        let rs = { receivedAt, _id, key: `${index}`}
        _.mapKeys(measuringLogs, (value, key) => {
          rs[key] = _.get(value, this.props.valueField)
          return key
        })
        return rs
      })
      this.columns = this.getCols(nextProps)
      this.setState({
        dataSource
      });
    }
  }

  handleSave = (row, values) => {
    const dataState = this.state 
    let data = _.get(dataState.dataChange, [row._id], {})
    dataState.dataChange[row._id] = {...data, ...values} 
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    if (this.props.handleSave) {
      this.props.handleSave(dataState)
    }
    this.setState({ dataSource: newData, dataChange: dataState.dataChange });
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={this.props.pagination}
          loading={this.props.loading}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default EditableTable