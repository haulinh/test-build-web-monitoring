import { Col, Form, Row, Select } from 'antd'
import SelectCity from 'components/elements/select-data/weather/SelectCity'
import SelectDayWeather, {
  optionsDay,
} from 'components/elements/select-data/weather/SelectDay'
import SelectParamenterWeather, {
  optionsWeather,
} from 'components/elements/select-data/weather/SelectParamenter'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { isCreate } from 'containers/api-sharing/util'
import React from 'react'

export const FIELDS = {
  CITY_ID: 'cityId',
  PARAMETER: 'parameterList',
  DAYS: 'days',
}

export default class Condition extends React.Component {
  state = {
    cities: [],
  }

  onFetchCitiesSuccess = cities => {
    const cityIdInit = cities[0].city_id
    this.setFormInit(cityIdInit)
  }

  setFormInit = cityId => {
    const { form, rule } = this.props

    if (!isCreate(rule)) {
      return
    }

    form.setFieldsValue({
      [`config.${FIELDS.CITY_ID}`]: cityId,
      [`config.${FIELDS.PARAMETER}`]: optionsWeather.map(item => item.key),
      [`config.${FIELDS.DAYS}`]: optionsDay[0].key,
    })
  }

  render() {
    const { form, isQuery, fieldsDefault = {} } = this.props
    return (
      <BoxShadow>
        {!isQuery && <Header>{i18n.detailPage.header.condition}</Header>}
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.country}>
              <Select
                style={{ width: '100%' }}
                value={i18n.init.country}
                disabled={true}
              ></Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.city}>
              {form.getFieldDecorator(
                `config.${FIELDS.CITY_ID}`,
                {}
              )(
                <SelectCity
                  onFetchSuccess={this.onFetchCitiesSuccess}
                  disabled={fieldsDefault[FIELDS.CITY_ID]}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.paramenter} required>
              {form.getFieldDecorator(`config.${FIELDS.PARAMETER}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectParamenterWeather
                  disabled={fieldsDefault[FIELDS.PARAMETER]}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.days} required>
              {form.getFieldDecorator(
                `config.${FIELDS.DAYS}`,
                {}
              )(<SelectDayWeather disabled={fieldsDefault[FIELDS.DAYS]} />)}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
