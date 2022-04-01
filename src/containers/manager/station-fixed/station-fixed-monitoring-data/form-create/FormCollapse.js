import { Col, Collapse, Input, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, FormCollapseContainer, i18n } from '../constants'

const { Panel } = Collapse

export default class FormCollapse extends Component {
  componentDidMount = () => {
    const { form, logData, formType } = this.props
    console.log(logData)
    if (formType === 'editReportLog') {
      setTimeout(() => {
        form.setFieldsValue({
          [`otherInfo.${FIELDS.OTHER.SAMPLER}`]: logData.sampler,
          [`otherInfo.${FIELDS.OTHER.MONITORING_PLACE}`]: logData.monitoringPlace,
          [`otherInfo.${FIELDS.OTHER.REQUIREMENTS}`]: logData.requirements,
          [`otherInfo.${FIELDS.OTHER.CHEMICAL}`]: logData.chemical,
          [`otherInfo.${FIELDS.OTHER.CONDITIONS}`]: logData.conditions,
          [`otherInfo.${FIELDS.OTHER.EQUIPMENTLIST}`]: logData.equipmentlist,
          [`otherInfo.${FIELDS.OTHER.METHOD}`]: logData.method,
          [`otherInfo.${FIELDS.OTHER.SYMBOL}`]: logData.symbol,
          [`otherInfo.${FIELDS.OTHER.WEATHER}`]: logData.weather,
          [`otherInfo.${FIELDS.OTHER.ANALYST}`]: logData.analyst,
          [`otherInfo.${FIELDS.OTHER.PLACE_OF_ANALYSIS}`]: logData.placeOfAnalysis,
          [`otherInfo.${FIELDS.OTHER.NOTES}`]: logData.notes,
        })
      })
    }
  }
  render() {
    const { form } = this.props

    console.log(form.getFieldsValue())
    return (
      <FormCollapseContainer>
        <Collapse expandIconPosition="left" defaultActiveKey={1}>
          <Panel key={1} header={i18n().drawer.formOtherInfo.title}>
            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.sampler}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SAMPLER}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.monitoringPlace}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.MONITORING_PLACE}`
                  )(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.requirements}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.REQUIREMENTS}`
                  )(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.method}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.METHOD}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.chemical}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.CHEMICAL}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.conditions}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.CONDITIONS}`
                  )(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.equipmentList}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.EQUIPMENTLIST}`
                  )(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.symbol}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SYMBOL}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.weather}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.WEATHER}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.analyst}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.ANALYST}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.placeOfAnalysis}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.PLACE_OF_ANALYSIS}`
                  )(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={i18n().drawer.formOtherInfo.note}
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.NOTES}`)(
                    <Input
                      placeholder={i18n().drawer.formOtherInfo.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <Clearfix height={12} />
      </FormCollapseContainer>
    )
  }
}
