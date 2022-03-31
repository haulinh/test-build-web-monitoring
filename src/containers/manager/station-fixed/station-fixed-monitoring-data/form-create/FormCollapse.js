import { Col, Collapse, Input, Row } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, FormCollapseContainer, i18n } from '../constants'

const { Panel } = Collapse

export default class FormCollapse extends Component {
  render() {
    const { form, logData, formType } = this.props

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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SAMPLER}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.sampler : '',
                  })(
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
                    `otherInfo.${FIELDS.OTHER.MONITORING_PLACE}`,
                    {
                      initialValue:
                        formType === 'editReportLog'
                          ? logData.monitoringPlace
                          : '',
                    }
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
                    `otherInfo.${FIELDS.OTHER.REQUIREMENTS}`,
                    {
                      initialValue:
                        formType === 'editReportLog'
                          ? logData.requirements
                          : '',
                    }
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.METHOD}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.method : '',
                  })(
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
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.CHEMICAL}`,
                    {
                      initialValue:
                        formType === 'editReportLog' ? logData.chemical : '',
                    }
                  )(
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
                    `otherInfo.${FIELDS.OTHER.CONDITIONS}`,
                    {
                      initialValue:
                        formType === 'editReportLog' ? logData.conditions : '',
                    }
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
                    `otherInfo.${FIELDS.OTHER.EQUIPMENTLIST}`,
                    {
                      initialValue:
                        formType === 'editReportLog'
                          ? logData.equipmentList
                          : '',
                    }
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SYMBOL}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.symbol : '',
                  })(
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.WEATHER}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.weather : '',
                  })(
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.ANALYST}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.analyst : '',
                  })(
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
                    `otherInfo.${FIELDS.OTHER.PLACE_OF_ANALYSIS}`,
                    {
                      initialValue:
                        formType === 'editReportLog'
                          ? logData.placeOfAnalysis
                          : '',
                    }
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.NOTES}`, {
                    initialValue:
                      formType === 'editReportLog' ? logData.notes : '',
                  })(
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
