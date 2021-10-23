import { Col, Row, Select } from 'antd'
import { Clearfix } from 'components/elements'
import SelectCities from 'components/elements/select-data/weather/SelectCity'
import SelectParamenterWeather, {
  optionsWeather,
} from 'components/elements/select-data/weather/SelectParamenter'
import FormItem from 'containers/api-sharing/component/FormItem'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { isCreate, isView } from 'containers/api-sharing/util'
import React from 'react'

export const FIELDS = {
  CITY_ID: 'cityId',
  PARAMETER: 'parameterList',
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
      [`config.${FIELDS.PARAMETER}`]: optionsWeather().map(item => item.key),
    })
  }

  isDisable = fieldName => {
    const { rule, fieldsDefault = {} } = this.props
    return isView(rule) && fieldsDefault[fieldName]
  }

  render() {
    const { form, isQuery } = this.props
    return (
      <BoxShadow>
        {!isQuery && <Header>{i18n().detailPage.header.condition}</Header>}
        <Clearfix height={12} />
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label={i18n().detailPage.label.country}>
              <Select
                style={{ width: '100%' }}
                value={i18n().init.country}
                disabled={true}
              ></Select>
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={i18n().detailPage.label.city}>
              {form.getFieldDecorator(
                `config.${FIELDS.CITY_ID}`,
                {}
              )(
                <SelectCities
                  onFetchSuccess={this.onFetchCitiesSuccess}
                  disabled={this.isDisable(FIELDS.CITY_ID)}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={i18n().detailPage.label.paramenter}>
              {form.getFieldDecorator(`config.${FIELDS.PARAMETER}`, {
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(
                <SelectParamenterWeather
                  disabled={this.isDisable(FIELDS.PARAMETER)}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
