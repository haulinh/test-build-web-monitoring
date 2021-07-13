import { Col, Form, Row } from 'antd'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  isCreate,
  isView,
} from 'containers/api-sharing/util'
import React from 'react'
import { Select } from 'antd'
import SelectCities from 'components/elements/select-data/city'
import SelectParamenterWeather, { optionsWeather } from 'components/elements/select-data/paramenter'

export const FIELDS = {
  CITY_ID: 'cityId',
  PARAMETER: 'parameterList',
  DAYS: 'days'
}

const options = [
  { key: '5', label: 5 },
  { key: '7', label: 7 }
]

export default class Condition extends React.Component {
  state = {
    cities: [],
    days: [],
  }

  getDays = (days) => {
    const dayInit = days[0].key
    this.setFormInit(dayInit)
  }

  onFetchCitiesSuccess = (cities) => {
    const cityIdInit = cities[0].city_id
    this.setFormInit(cityIdInit)
  }

  setFormInit = (cityId, day) => {
    const { form, rule } = this.props

    if (!isCreate(rule)) {
      return
    }

    form.setFieldsValue({
      [`config.${FIELDS.CITY_ID}`]: cityId,
      [`config.${FIELDS.PARAMETER}`]: optionsWeather.map(item => item.key),
      [`config.${FIELDS.DAYS}`]: day
    })
  }

  render() {
    const { form, rule } = this.props
    return (
      <BoxShadow>
        <Header>{i18n.detailPage.header.condition}</Header>
        <Row gutter={12}>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.country}>
              <Select style={{ width: '100%' }} value={i18n.init.country} disabled={true}></Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.city}>
              {form.getFieldDecorator(`config.${FIELDS.CITY_ID}`, {
              })(
                <SelectCities
                  onFetchSuccess={this.onFetchCitiesSuccess}
                  disabled={isView(rule)}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.paramenter} required>
              {form.getFieldDecorator(`config.${FIELDS.PARAMETER}`, {
              })(
                <SelectParamenterWeather
                  disabled={isView(rule)}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.days} required>
              {form.getFieldDecorator(`config.${FIELDS.DAYS}`, {
              })(
                <Select style={{ width: '100%' }}>
                  {options.map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow >
    )
  }
}
