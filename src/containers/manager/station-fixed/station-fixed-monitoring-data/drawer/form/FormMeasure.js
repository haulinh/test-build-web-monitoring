import React, { Component } from 'react'
import { FormItem } from 'components/layouts/styles'
import { FIELDS } from '../../constants'
import { Input, Button, Popconfirm, Icon } from 'antd'
import SelectMeasure from '../select/SelectMeasure'

export default class FormMeasure extends Component {
  render() {
    const {
      form,
      measuringList,
      onClickAddMeasure,
      handleDelete,
      measuringNotSelect,
      onChangeMeasure,
    } = this.props

    const isShowAdd = measuringList.length > 0

    return (
      <div>
        <div className="title">Thông tin cơ bản</div>

        {measuringList.map(measure => (
          <div key={measure._id} className="row-form">
            <FormItem label="Thông số" style={{ width: '50%' }}>
              {form.getFieldDecorator(`measure.${measure._id}.key`, {
                onChange: onChangeMeasure,
                // rules: [
                //   {
                //     required: true,
                //   },
                // ],
              })(<SelectMeasure measuringList={measuringList} />)}
            </FormItem>

            <FormItem label="Giá trị" style={{ width: '50%' }}>
              {form.getFieldDecorator(`measure.${measure._id}.value`, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{ width: '100%' }} placeholder="Giá trị" />)}
            </FormItem>

            <Popconfirm
              title="Xac nhan xoa"
              okText="Dong y"
              cancelText="Huy bo"
              onConfirm={() => handleDelete(measure._id)}
            >
              <div
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  alignSelf: 'center',
                }}
              >
                <Icon
                  type="delete"
                  style={{ fontSize: '16px', color: 'red' }}
                />
              </div>
            </Popconfirm>
          </div>
        ))}
        {isShowAdd ? (
          <Button onClick={onClickAddMeasure}>Them thong so</Button>
        ) : null}
      </div>
    )
  }
}
