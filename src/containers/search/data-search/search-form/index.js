import { Button, Col, Form, Row, Switch } from 'antd'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { autobind } from 'core-decorators'
import createLang, { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

const SearchFormContainer = styled(BoxShadowStyle)``
const Container = styled.div`
  padding: 16px 16px;
`

const qaqcObj = {
  zero: 'Zero',
  negative: 'Negative',
  repeat: 'Repeat',
  error: 'Error',
  calibration: 'Calibration',
  beyondMeasuringRange: 'BeyondMeasuringRange',
  timeRange: 'TimeRange',
  valueRange: 'ValueRange',
}

const qaqcOptions = [
  {
    value: qaqcObj.beyondMeasuringRange,
    name: translate('qaqcConfig.beyondMeasuringRange'),
  },
  {
    value: qaqcObj.error,
    name: translate('qaqcConfig.deviceError'),
  },
  {
    value: qaqcObj.calibration,
    name: translate('qaqcConfig.deviceCalibration'),
  },
  {
    value: qaqcObj.zero,
    name: translate('qaqcConfig.zero'),
  },
  {
    value: qaqcObj.negative,
    name: translate('qaqcConfig.negative'),
  },
  {
    value: qaqcObj.timeRange,
    name: translate('qaqcConfig.timeRange'),
  },
  {
    value: qaqcObj.valueRange,
    name: translate('qaqcConfig.valueRange'),
  },
  {
    value: qaqcObj.repeat,
    name: translate('qaqcConfig.basic.repeat'),
  },
]

// function validate(values) {
//   const errors = {}
//   if (!values.stationType)
//     errors.stationType = translate('avgSearchFrom.form.stationType.error')
//   if (!values.stationAuto || values.stationAuto === '')
//     errors.stationAuto = translate('avgSearchFrom.form.stationAuto.error')
//   if (!values.type) errors.type = translate('avgSearchFrom.form.type.error')

//   if (!values.rangesDate) {
//     errors.rangesDate = translate('avgSearchFrom.form.rangesDate.error')
//   }

//   if (values.measuringList && values.measuringList.length === 0)
//     errors.measuringList = translate('avgSearchFrom.form.measuringList.require')

//   return errors
// }

const fields = {
  stationAuto: 'stationAuto',
  stationType: 'stationType',
  rangesDate: 'rangesDate',
  queryType: 'queryType',
  qcvnOptions: 'qcvnOptions',
  isExceeded: 'isExceeded',
  province: 'province',
  measuringList: 'measuringList',
}

@Form.create()
@createLang
@autobind
export default class SearchFormHistoryData extends React.Component {
  state = {
    stationAutoSelected: {},
  }

  getMeasureOptions = () => {
    const { stationAutoSelected } = this.state
    const measuringList = getMeasuringListFromStationAutos([
      stationAutoSelected,
    ])
    const measureOptions = measuringList.map(measure => ({
      value: measure.key,
      name: measure.name,
    }))
    return measureOptions
  }

  setStationAutoSelected = stationAutoSelected => {
    this.setState({ stationAutoSelected })
  }

  handleOnSearch = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    console.log({ values })
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    const { form } = this.props

    const {
      [fields.province]: province,
      [fields.stationType]: stationType,
      [fields.queryType]: queryType,
    } = form.getFieldsValue()
    const measureOptions = this.getMeasureOptions()

    return (
      <Container>
        <Row gutter={[16, 24]}>
          <Col span={3}>
            <FormItem label={translate('qaqc.province.label')}>
              {form.getFieldDecorator(fields.province, { initialValue: '' })(
                <SelectProvince
                  isShowAll
                  size="large"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label={t('stationType.label')}>
              {form.getFieldDecorator(fields.stationType)(
                <SelectStationType style={{ width: '100%' }} size="large" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={t('stationAuto.label')}>
              {form.getFieldDecorator(fields.stationAuto, {
                rules: [
                  {
                    required: true,
                    message: translate('avgSearchFrom.form.stationAuto.error'),
                  },
                ],
              })(
                <SelectStationAuto
                  isShowAll
                  onChangeObject={this.setStationAutoSelected}
                  size="large"
                  province={province}
                  stationType={stationType}
                />
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label={t('time')}>
              {form.getFieldDecorator(fields.rangesDate, { initialValue: 1 })(
                <OptionsTimeRange style={{ width: '100%' }} size="large" />
              )}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label={t('measuringList.label')}>
              {form.getFieldDecorator(fields.measuringList)(
                <SelectAnt
                  mode="multiple"
                  options={measureOptions}
                  style={{ width: '100%' }}
                  size="large"
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label={t('isExceeded.label')}>
              {form.getFieldDecorator(fields.isExceeded)(
                <Switch size="large" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label={translate('dataSearchFrom.queryType')}>
              {form.getFieldDecorator(fields.queryType, {
                initialValue: 'origin',
              })(<SelectQueryType size="large" isShowAll />)}
            </FormItem>
          </Col>
          {queryType === 'invalid' && (
            <Col span={12}>
              <FormItem label={translate('dataSearchFrom.filterDataBy')}>
                {form.getFieldDecorator(fields.qcvnOptions)(
                  <SelectAnt
                    style={{ width: '100%' }}
                    options={qaqcOptions}
                    mode="multiple"
                    size="large"
                    showSearch
                  />
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </Container>
    )
  }
}
