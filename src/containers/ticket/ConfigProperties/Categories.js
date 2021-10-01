import { Col, Icon, Input, Row } from 'antd';
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import { FormItem } from 'components/layouts/styles'

class Categories extends Component {
  i18n = () => ({
    button: t('ticket.label.configProperties.category'),
    error: t('ticket.required.configProperties.required')
  })

  render() {
    const { form, onCreateCategory, onDelSubCategory, listCategory = [] } = this.props

    return (
      <div>
        <Row type="flex" justify="space-between">
          <Col>
            <FormItem label={this.i18n().button}></FormItem>
          </Col>
          <Col>
            <Icon
              onClick={onCreateCategory}
              type="plus" theme='outlined'
              style={{
                color: "#008EFA",
                backgroundColor: "#E6F7FF",
                fontSize: "14px",
                padding: 6,
                borderRadius: 4
              }} />
          </Col>
        </Row>
        {
          listCategory.map((item, idx) => {
            return (
              <div key={item}>
                <Row>
                  <Col span={1} style={{ paddingTop: 6, paddingRight: 25 }}>
                    <Icon type="menu" style={{ color: "#BFBFBF", fontSize: "16px" }}></Icon>
                  </Col>
                  <Col span={22}>
                    <FormItem>
                      {form.getFieldDecorator(`categories[${item}]`, {
                        rules: [
                          {
                            required: true,
                            message: this.i18n().error
                          }
                        ]
                      })(
                        <Input
                          suffix={
                            <Icon
                              onClick={() => onDelSubCategory(idx)}
                              type="close"
                              style={{ color: "#BFBFBF", fontSize: "12px" }} />
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Categories
