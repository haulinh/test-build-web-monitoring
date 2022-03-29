import React, { Component } from 'react'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { FIELDS } from '../constants'
import { Input, Button, Popconfirm, Icon, Row, Col } from 'antd'
import SelectMeasure from '../components/SelectMeasure'
import _ from 'lodash'

export default class FormMeasure extends Component {
  convertDataMeasureObj = measuringList => {
    const newDataMeasure = measuringList.reduce((base, current) => {
      return {
        ...base,
        [current._id]: {
          key: current.key,
          value: current.value,
        },
      }
    }, {})

    return newDataMeasure
  }

  setInitialValueMeasure = measuringList => {
    const { form } = this.props

    const initMeasure = this.convertDataMeasureObj(measuringList)

    form.setFieldsValue({
      [FIELDS.MEASURING_LOGS]: initMeasure,
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { measuringList } = this.props
    if (!_.isEqual(measuringList, prevProps.measuringList)) {
      setTimeout(() => {
        this.setInitialValueMeasure(measuringList)
      })
    }
  }

  render() {
    const {
      form,
      measuringList,
      onClickAddMeasure,
      handleDelete,
      isShowButton,
      measuringListSelect,
      onChangeMeasure,
    } = this.props

    const formDynamic = measuringList.map(measure => (
      <Row
        gutter={16}
        justify="space-between"
        type="flex"
        style={{ width: '100%' }}
        key={measure._id}
      >
        <Col span={12}>
          <FormItem label="Thông số">
            {form.getFieldDecorator(
              `${FIELDS.MEASURING_LOGS}.${measure._id}.key`,
              {
                onChange: onChangeMeasure,
                message: 'Vui lòng chọn thông số',
              }
            )(<SelectMeasure measuringList={measuringListSelect} />)}
          </FormItem>
        </Col>

        <Col span={12}>
          <Row type="flex">
            <Col span={21}>
              <FormItem label="Giá trị">
                {form.getFieldDecorator(
                  `${FIELDS.MEASURING_LOGS}.${measure._id}.value`,
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng nhập giá trị',
                      },
                    ],
                  }
                )(<Input placeholder="Giá trị" />)}
              </FormItem>
            </Col>

            <Col span={3} style={{ textAlign: 'right', alignSelf: 'center' }}>
              <Popconfirm
                title="Bạn có muốn xóa mục này không?"
                okText="Đồng ý"
                cancelText="Hủy bỏ"
                onConfirm={() => handleDelete(measure._id)}
              >
                <Icon
                  type="delete"
                  style={{ fontSize: '16px', color: 'red' }}
                />
              </Popconfirm>
            </Col>
          </Row>
        </Col>
      </Row>
    ))

    return (
      <div>
        <div className="title">Thông số</div>

        {formDynamic}

        {isShowButton && (
          <Button onClick={onClickAddMeasure} type="link">
            <Row>
              <Icon type="plus" />
              <span> Thêm thông số</span>
            </Row>
          </Button>
        )}

        <Clearfix height={16} />
      </div>
    )
  }
}
