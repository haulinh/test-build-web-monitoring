import { Button, Col, Icon, Input, Popconfirm, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectMeasure from '../components/SelectMeasure'
import { FIELDS, i18n } from '../constants'

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

      const validateValue = (rule, value, callBack) => {
        if (/^(>|<)?=?\s*-?(\d+)((\.|,)\d*)?$/gi.test(value)) {
          callBack(i18n().drawer.formMeasure.message.format)
          return
        }
        callBack()
      }

      return (
        <Row
          gutter={16}
          justify="space-between"
          type="flex"
          style={{ width: '100%' }}
          key={measure._id}
        >
          <Col span={12}>
            <FormItem label={i18n().drawer.formMeasure.measure}>
              {form.getFieldDecorator(
                `${FIELDS.MEASURING_LOGS}.${measure._id}.key`,
                {
                  onChange: onChangeMeasure,
                  rules: [
                    {
                      required: true,
                      message: i18n().drawer.formMeasure.message.measure,
                    },
                  ],
                }
              )(
                <SelectMeasure
                  measuringList={measuringListSelect}
                  placeholder={i18n().drawer.formMeasure.measure}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <Row type="flex">
              <Col span={21}>
                <FormItem label={i18n().drawer.formMeasure.value}>
                  {form.getFieldDecorator(
                    `${FIELDS.MEASURING_LOGS}.${measure._id}.value`,
                    {
                      rules: [
                        {
                          required: true,
                          message: i18n().drawer.formMeasure.message.value,
                        },
                        {
                          whitespace: true,
                          message: i18n().drawer.formMeasure.message.value,
                        },
                        {
                          max: 64,
                          message: i18n().drawer.formBasic.message.nameReport
                            .max64,
                        },

                        {
                          validator: validateValue,
                        },
                      ],
                    }
                  )(
                    <Input
                      placeholder={i18n().drawer.formMeasure.value}
                      suffix={_.get(measuresObj[key], 'unit')}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={3} style={{ textAlign: 'right', alignSelf: 'center' }}>
                <Popconfirm
                  title={i18n().drawer.formMeasure.popupDelete.title}
                  okText={i18n().button.accept}
                  cancelText={i18n().button.cancel}
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
        <div className="title">{i18n().drawer.formMeasure.title}</div>

        {formDynamic}

        {isShowButton && (
          <Button onClick={onClickAddMeasure} type="link">
            <Row>
              <Icon type="plus" />
              <span> {i18n().drawer.formMeasure.buttonAdd}</span>
            </Row>
          </Button>
        )}

        <Clearfix height={16} />
      </div>
    )
  }
}
