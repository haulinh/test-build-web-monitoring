import { Button, Col, Icon, Input, Popconfirm, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectMeasure from '../components/SelectMeasure'
import { FIELDS } from '../constants'

@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
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
      measuringList,
      onClickAddMeasure,
      handleDelete,
      isShowButton,
      measuringListSelect,
      onChangeMeasure,
    } = this.props

    const isDisableDelete = measuringList.length <= 1

    const formDynamic = measuringList.map(measure => {
      const { form, measuresObj } = this.props

      const measureKeyForm = form.getFieldsValue([
        `${FIELDS.MEASURING_LOGS}.${measure._id}.key`,
      ])

      const key = measureKeyForm.measuringLogs[measure._id].key

      return (
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
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn thông số',
                    },
                  ],
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
                  )(
                    <Input
                      placeholder="Giá trị"
                      suffix={_.get(measuresObj[key], 'unit')}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={3} style={{ textAlign: 'right', alignSelf: 'center' }}>
                <Popconfirm
                  title="Bạn có muốn xóa mục này không?"
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                  disabled={isDisableDelete}
                  onConfirm={() => handleDelete(measure._id)}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Icon
                    type="delete"
                    style={{
                      fontSize: '16px',
                      color: isDisableDelete ? '#A2A7B3' : 'red',
                    }}
                  />
                </Popconfirm>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    })

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
