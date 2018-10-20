import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox, Table } from 'antd'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from '../../../../hoc/create-lang'

@Form.create({
  mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoConfigApprove extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    measuringListSource: PropTypes.array
  }
  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      mesureSourceData: []
    }
  }

  getColums = () => {
    return [
      {
        title: 'Parameter Name',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        render: value => value
      },
      {
        title: 'Role',
        children: [
          {
            title: 'Role 1',
            dataIndex: '',
            key: 'Role1',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                defaultChecked={true}
                name="warning.allowed"
                data={row}
                // onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: 'Role 2',
            dataIndex: '',
            key: 'Role2',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                defaultChecked={true}
                name="warning.allowed"
                data={row}
                // onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: 'Role 3',
            dataIndex: '',
            key: 'Role3',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                defaultChecked={true}
                name="warning.allowed"
                data={row}
                // onChange={this.onChangeCheckbox}
              />
            )
          },
          {
            title: 'Role 4',
            dataIndex: '',
            key: 'Role4',
            align: 'center',
            width: '18%',
            render: (value, row) => (
              <Checkbox
                defaultChecked={true}
                name="warning.allowed"
                data={row}
                // onChange={this.onChangeCheckbox}
              />
            )
          }
        ]
      }
    ]
  }

  render() {
    //  console.log(this.props.measuringListSource)
    return (
      <Table
        bordered
        title={() => 'Cấu hình loại bỏ dữ liệu'}
        footer={() => '*Note: Cấu hình loại bỏ dữ liệu tự động'}
        rowKey="key"
        size="small"
        columns={this.getColums()}
        dataSource={this.props.measuringListSource}
      />
    )
  }
}
